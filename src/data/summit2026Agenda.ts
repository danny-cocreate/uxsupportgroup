export type AgendaRow = {
  time: string;
  title: string;
  facilitator?: string;
  /** Short topic/theme label rendered as a pill on facilitator cards (e.g. "Trust", "Multimodal"). */
  theme?: string;
};

export type AgendaSessionWithDay = AgendaRow & {
  /** "Day 1" | "Day 2" */
  dayLabel: string;
  /** Day-level theme (e.g. "The Shift", "The Practice"). */
  dayTheme: string;
};

export const DAY1_THEME = "The Shift";
export const DAY2_THEME = "The Practice";

/** Long-form day labels used in the facilitator modal session list. */
export const DAY1_DATE_LABEL = "Day 1 · Thu, Jun 18";
export const DAY2_DATE_LABEL = "Day 2 · Fri, Jun 19";

/** Timezone suffix appended to agenda times when shown in the modal. */
export const SUMMIT_TIME_SUFFIX = "EDT";

/** First-name keys used in the agenda; map full facilitator name -> agenda key. */
const FACILITATOR_AGENDA_KEY: Record<string, string> = {
  "Suyen Stevenson": "Suyen",
  "Danny Setiawan": "Danny",
  "Silvia Balu": "Silvia",
  "Esther Greenfield-Jakar": "Esther",
  "Corey Malone": "Corey",
  "Volkan Unsal": "Volkan",
  "Renata Rocha": "Renata",
  "Alexis Brochu": "Alexis",
};

/** Rows we don't want to surface as a facilitator's "primary" session. */
const NON_PRIMARY_TITLE_PATTERNS = [
  /^Welcome/i,
  /^Close/i,
  /^Break/i,
  /Day 2 preview/i,
];

const isPrimaryTitle = (title: string) =>
  !NON_PRIMARY_TITLE_PATTERNS.some((re) => re.test(title));

/** Returns all agenda rows this facilitator is listed on, across both days, in order. */
export function getFacilitatorAgendaSessions(
  facilitatorName: string,
): AgendaSessionWithDay[] {
  const key = FACILITATOR_AGENDA_KEY[facilitatorName];
  if (!key) return [];
  const matches = (row: AgendaRow) =>
    !!row.facilitator &&
    row.facilitator.split("/").map((s) => s.trim()).includes(key);
  return [
    ...AGENDA_DAY1.filter(matches).map((r) => ({
      ...r,
      dayLabel: "Day 1",
      dayTheme: DAY1_THEME,
    })),
    ...AGENDA_DAY2.filter(matches).map((r) => ({
      ...r,
      dayLabel: "Day 2",
      dayTheme: DAY2_THEME,
    })),
  ];
}

/** Picks the most substantive session for a facilitator (skips Welcome/Close/Break). */
export function getPrimaryFacilitatorSession(
  facilitatorName: string,
  excludeTitles: string[] = [],
): AgendaSessionWithDay | undefined {
  return getPrimaryFacilitatorSessions(facilitatorName, excludeTitles)[0];
}

/** All substantive sessions for a facilitator (skips Welcome/Close/Break + caller-excluded titles). */
export function getPrimaryFacilitatorSessions(
  facilitatorName: string,
  excludeTitles: string[] = [],
): AgendaSessionWithDay[] {
  const exclude = new Set(excludeTitles);
  return getFacilitatorAgendaSessions(facilitatorName).filter(
    (s) => isPrimaryTitle(s.title) && !exclude.has(s.title),
  );
}

export const agendaRowKey = (row: AgendaRow) => `${row.time}-${row.title}`;

export const AGENDA_DAY1: AgendaRow[] = [
  {
    time: "09:00 AM",
    title: "Welcome",
    facilitator: "Suyen",
  },
  {
    time: "09:15 AM",
    title: "Keynote: Designer's New Mandate",
    facilitator: "Danny",
  },
  {
    time: "10:00 AM",
    title:
      "Create Your Summit Agent (build a simple agent you'll use/refine throughout the summit)",
    facilitator: "Danny",
  },
  { time: "10:45 AM", title: "Break (15 min)" },
  {
    time: "11:00 AM",
    title: "Designing Trust in Agentic AI",
    facilitator: "Silvia",
  },
  { time: "11:55 AM", title: "Break (5 min)" },
  {
    time: "12:00 PM",
    title: "Designing from Vision to Outcome in Agentic AI",
    facilitator: "Esther",
  },
  { time: "12:45 PM", title: "Break (5 min)" },
  {
    time: "12:50 PM",
    title: "Designing Multimodal Futures in Agentic AI",
    facilitator: "Corey",
  },
  {
    time: "01:50 PM",
    title: "Close & Day 2 preview",
    facilitator: "Suyen/Danny",
  },
];

export const AGENDA_DAY2: AgendaRow[] = [
  {
    time: "09:00 AM",
    title: "Welcome back",
    facilitator: "Suyen",
  },
  {
    time: "09:15 AM",
    title: "Three Agents, No Heroes: An Orchestrator's Field Report",
    facilitator: "Volkan",
  },
  { time: "10:15 AM", title: "Break (5 min)" },
  {
    time: "10:20 AM",
    title: "Building Your Working Process",
    facilitator: "Suyen",
  },
  { time: "11:20 AM", title: "Break (5 min)" },
  {
    time: "11:25 AM",
    title: "Auditing & Trusting Agent Output",
    facilitator: "MT",
  },
  { time: "12:10 PM", title: "Break (15 min)" },
  {
    time: "12:25 PM",
    title: "Discover Your Next Move",
    facilitator: "Renata",
  },
  { time: "01:25 PM", title: "Break (5 min)" },
  {
    time: "01:30 PM",
    title: "Design Your AI Networking Agent",
    facilitator: "Alexis",
  },
  {
    time: "02:30 PM",
    title: "Close",
    facilitator: "Suyen/Danny",
  },
];
