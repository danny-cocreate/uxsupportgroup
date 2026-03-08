#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OPEN_CODES = new Set(['BTO', 'STO']);
const CLOSE_CODES = new Set(['STC', 'BTC']);
const TRADE_CODES = new Set(['BTO', 'STO', 'STC', 'BTC']);
const TRANSFER_CODES = new Set(['ACH']);
const OCC_CODES = new Set(['OCC']);

function parseArgs(argv) {
  const args = {
    strict: false,
    output: null,
    includeTransfers: false,
    input: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') {
      args.strict = true;
      continue;
    }
    if (arg === '--include-transfers') {
      args.includeTransfers = true;
      continue;
    }
    if (arg === '--output') {
      args.output = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (!args.input) {
      args.input = arg;
      continue;
    }
    throw new Error(`Unexpected argument: ${arg}`);
  }

  if (!args.input) {
    throw new Error('Usage: node scripts/reconcile-daily-pl.cjs <input.csv> [--output out.csv] [--strict] [--include-transfers]');
  }

  return args;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(field);
      field = '';
      continue;
    }

    if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeRows(rows) {
  if (rows.length === 0) {
    throw new Error('CSV has no rows');
  }

  const header = rows[0];
  const out = [];

  for (let i = 1; i < rows.length; i += 1) {
    const raw = rows[i];
    const isAllBlank = raw.every((value) => String(value || '').trim() === '');
    if (isAllBlank) {
      continue;
    }

    const joined = raw.join(' ').trim();
    if (joined.includes('The data provided is for informational purposes')) {
      continue;
    }

    const record = {};
    for (let j = 0; j < header.length; j += 1) {
      record[header[j]] = (raw[j] || '').trim();
    }
    record.__rowIndex = i + 1; // 1-indexed CSV line number.
    out.push(record);
  }

  return out;
}

function parseDateToIso(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    throw new Error(`Invalid date: ${value}`);
  }
  const month = match[1].padStart(2, '0');
  const day = match[2].padStart(2, '0');
  const year = match[3];
  return `${year}-${month}-${day}`;
}

function parseMoneyToCents(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return null;
  }

  const isNegative = trimmed.startsWith('(') && trimmed.endsWith(')');
  const core = isNegative ? trimmed.slice(1, -1) : trimmed;
  const normalized = core.replace(/\$/g, '').replace(/,/g, '').trim();

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`Invalid money value: ${value}`);
  }

  const [dollars, centsPart = ''] = normalized.split('.');
  const cents = Number(dollars) * 100 + Number(centsPart.padEnd(2, '0'));
  return isNegative ? -cents : cents;
}

function parseQuantity(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return null;
  }
  const match = trimmed.match(/^(\d+)/);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}

function centsToMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100);
  const part = String(abs % 100).padStart(2, '0');
  return `${sign}${whole}.${part}`;
}

function normalizeDescription(description) {
  const cleaned = String(description || '')
    .replace(/^Option Expiration for\s+/i, '')
    .replace(/^Option Assignment for\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  return cleaned;
}

function contractKey(instrument, description) {
  const inst = String(instrument || '').trim().toUpperCase() || 'UNKNOWN';
  const desc = normalizeDescription(description) || 'UNKNOWN_DESCRIPTION';
  return `${inst}|${desc}`;
}

function allocateProRata(totalCents, totalQty, allocQty) {
  if (allocQty === totalQty) {
    return totalCents;
  }
  const raw = (totalCents * allocQty) / totalQty;
  return totalCents >= 0 ? Math.floor(raw) : Math.ceil(raw);
}

function ensureDay(days, date) {
  if (!days.has(date)) {
    days.set(date, {
      date,
      realizedKnownCents: 0,
      occAdjustmentCents: 0,
      netCashExTransfersCents: 0,
      transferCents: 0,
      matchedCloseQty: 0,
      unmatchedCloseQty: 0,
      unmatchedCloseCashCents: 0,
      tradeRows: 0
    });
  }
  return days.get(date);
}

function reconcile(records, options) {
  const ordered = [...records].sort((a, b) => {
    const ad = parseDateToIso(a['Activity Date']) || '';
    const bd = parseDateToIso(b['Activity Date']) || '';
    if (ad !== bd) return ad < bd ? -1 : 1;
    const ap = parseDateToIso(a['Process Date']) || '';
    const bp = parseDateToIso(b['Process Date']) || '';
    if (ap !== bp) return ap < bp ? -1 : 1;
    // Broker exports are commonly newest-first, so reverse line order within each day.
    return b.__rowIndex - a.__rowIndex;
  });

  const books = new Map();
  const days = new Map();
  const warnings = [];

  function getBook(key) {
    if (!books.has(key)) {
      books.set(key, { longLots: [], shortLots: [] });
    }
    return books.get(key);
  }

  for (const row of ordered) {
    const transCode = String(row['Trans Code'] || '').trim().toUpperCase();
    const date = parseDateToIso(row['Activity Date']);
    if (!date) {
      warnings.push(`Skipping row ${row.__rowIndex}: missing activity date.`);
      continue;
    }
    const day = ensureDay(days, date);
    const amountCents = parseMoneyToCents(row.Amount);

    if (amountCents !== null) {
      if (TRANSFER_CODES.has(transCode)) {
        day.transferCents += amountCents;
      } else {
        day.netCashExTransfersCents += amountCents;
      }
    }

    if (OCC_CODES.has(transCode) && amountCents !== null) {
      day.occAdjustmentCents += amountCents;
      continue;
    }

    if (!TRADE_CODES.has(transCode)) {
      continue;
    }

    day.tradeRows += 1;
    const quantity = parseQuantity(row.Quantity);
    if (!quantity || quantity <= 0) {
      const msg = `Row ${row.__rowIndex} (${transCode}) has invalid quantity: "${row.Quantity}"`;
      if (options.strict) {
        throw new Error(msg);
      }
      warnings.push(`Skipping ${msg}`);
      continue;
    }
    if (amountCents === null) {
      const msg = `Row ${row.__rowIndex} (${transCode}) missing amount.`;
      if (options.strict) {
        throw new Error(msg);
      }
      warnings.push(`Skipping ${msg}`);
      continue;
    }

    const key = contractKey(row.Instrument, row.Description);
    const book = getBook(key);

    if (OPEN_CODES.has(transCode)) {
      const targetLots = transCode === 'BTO' ? book.longLots : book.shortLots;
      targetLots.push({
        qtyRemaining: quantity,
        cashRemainingCents: amountCents,
        openedAtRow: row.__rowIndex
      });
      continue;
    }

    const isCloseLong = transCode === 'STC';
    const lots = isCloseLong ? book.longLots : book.shortLots;

    let remainingQty = quantity;
    let remainingCloseCashCents = amountCents;
    let remainingCloseQtyForCash = quantity;

    while (remainingQty > 0 && lots.length > 0) {
      const lot = lots[0];
      const takeQty = Math.min(remainingQty, lot.qtyRemaining);
      const openCashAlloc = allocateProRata(lot.cashRemainingCents, lot.qtyRemaining, takeQty);
      const closeCashAlloc = allocateProRata(remainingCloseCashCents, remainingCloseQtyForCash, takeQty);
      const realizedPiece = openCashAlloc + closeCashAlloc;

      day.realizedKnownCents += realizedPiece;
      day.matchedCloseQty += takeQty;

      lot.qtyRemaining -= takeQty;
      lot.cashRemainingCents -= openCashAlloc;
      if (lot.qtyRemaining === 0) {
        lots.shift();
      }

      remainingQty -= takeQty;
      remainingCloseQtyForCash -= takeQty;
      remainingCloseCashCents -= closeCashAlloc;
    }

    if (remainingQty > 0) {
      const msg = `Unmatched close on row ${row.__rowIndex} (${transCode}) for ${remainingQty} contract(s) in ${key}`;
      if (options.strict) {
        throw new Error(msg);
      }
      warnings.push(msg);
      day.unmatchedCloseQty += remainingQty;
      day.unmatchedCloseCashCents += remainingCloseCashCents;
    }
  }

  const openLots = [];
  for (const [key, book] of books.entries()) {
    for (const lot of book.longLots) {
      openLots.push({
        contract: key,
        side: 'LONG',
        qtyRemaining: lot.qtyRemaining,
        openCashRemainingCents: lot.cashRemainingCents,
        openedAtRow: lot.openedAtRow
      });
    }
    for (const lot of book.shortLots) {
      openLots.push({
        contract: key,
        side: 'SHORT',
        qtyRemaining: lot.qtyRemaining,
        openCashRemainingCents: lot.cashRemainingCents,
        openedAtRow: lot.openedAtRow
      });
    }
  }

  const daily = [...days.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
  return { daily, openLots, warnings };
}

function formatDailyCsv(daily, includeTransfers) {
  const header = [
    'date',
    'realized_pl_known',
    'occ_adjustment',
    'daily_pl_reconciled',
    'net_cash_ex_transfers',
    includeTransfers ? 'transfers' : null,
    includeTransfers ? 'net_cash_including_transfers' : null,
    'matched_close_qty',
    'unmatched_close_qty',
    'unmatched_close_cash',
    'trade_rows'
  ].filter(Boolean);

  const lines = [header.join(',')];
  for (const d of daily) {
    const row = [
      d.date,
      centsToMoney(d.realizedKnownCents),
      centsToMoney(d.occAdjustmentCents),
      centsToMoney(d.realizedKnownCents + d.occAdjustmentCents),
      centsToMoney(d.netCashExTransfersCents),
      includeTransfers ? centsToMoney(d.transferCents) : null,
      includeTransfers ? centsToMoney(d.netCashExTransfersCents + d.transferCents) : null,
      String(d.matchedCloseQty),
      String(d.unmatchedCloseQty),
      centsToMoney(d.unmatchedCloseCashCents),
      String(d.tradeRows)
    ].filter((v) => v !== null);
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

function printSummary(result) {
  const totalRealized = result.daily.reduce((sum, d) => sum + d.realizedKnownCents, 0);
  const totalOcc = result.daily.reduce((sum, d) => sum + d.occAdjustmentCents, 0);
  const totalUnmatchedQty = result.daily.reduce((sum, d) => sum + d.unmatchedCloseQty, 0);
  const totalUnmatchedCash = result.daily.reduce((sum, d) => sum + d.unmatchedCloseCashCents, 0);

  console.log('Daily reconciliation complete.');
  console.log(`Known realized P/L total: ${centsToMoney(totalRealized)}`);
  console.log(`OCC adjustment total: ${centsToMoney(totalOcc)}`);
  console.log(`Reconciled total (realized + OCC): ${centsToMoney(totalRealized + totalOcc)}`);
  console.log(`Unmatched close quantity: ${totalUnmatchedQty}`);
  console.log(`Unmatched close cash: ${centsToMoney(totalUnmatchedCash)}`);
  console.log(`Open lots carried out: ${result.openLots.length}`);

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const text = fs.readFileSync(inputPath, 'utf8');
  const rawRows = parseCsv(text);
  const records = normalizeRows(rawRows);
  const result = reconcile(records, { strict: args.strict });

  const csvOut = formatDailyCsv(result.daily, args.includeTransfers);
  if (args.output) {
    const outPath = path.resolve(args.output);
    fs.writeFileSync(outPath, `${csvOut}\n`, 'utf8');
    console.log(`Wrote daily P/L CSV to: ${outPath}`);
  } else {
    console.log(csvOut);
  }

  printSummary(result);
}

main();
