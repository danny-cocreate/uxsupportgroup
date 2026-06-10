# Archived: Summit 2026 agenda flip-card + session details

Archived on 2026-06-10. The agenda no longer exposes per-session details, so the
flip-card interaction (front = schedule, back = session description + outcomes)
and its supporting data/types/CSS were removed from the live page. Everything
needed to restore it is preserved below.

Restore by re-adding each piece to its original home:
- TSX → `src/pages/Summit2026V1.tsx` (agenda `rows.map` render + `flippedRowByDay` state)
- Types/helper → `src/data/summit2026Agenda.ts`
- CSS → `src/index.css` (inside the same `@layer` block)

Note: `.summit-detail-pill` (base style), `.summit-button-highlight`, and the
`.summit-facilitator-card-frame …` rules were intentionally KEPT in `index.css`
because the facilitator cards still use them. Only the agenda-specific rules below
were removed.

---

## 1. Data types + helper (`src/data/summit2026Agenda.ts`)

```ts
export type AgendaRowDetails = {
  description?: string;
  outcomes?: string[];
};

// On AgendaRow:
//   details?: AgendaRowDetails;

export const hasAgendaDetails = (row: AgendaRow) =>
  Boolean(
    row.details &&
      (row.details.description || (row.details.outcomes && row.details.outcomes.length > 0)),
  );
```

## 2. Page state (`src/pages/Summit2026V1.tsx`)

```tsx
const [flippedRowByDay, setFlippedRowByDay] = useState<Record<string, string | null>>({});
```

Import to restore alongside `agendaRowKey`:

```tsx
import { hasAgendaDetails } from "@/data/summit2026Agenda";
```

## 3. Agenda card render (`src/pages/Summit2026V1.tsx`)

Replaces the static card body inside `.map(({ day, hours, theme, rows }) => { … })`.

```tsx
const flippedKey = flippedRowByDay[day] ?? null;
const flippedRow = flippedKey
  ? rows.find((r) => agendaRowKey(r) === flippedKey)
  : null;
const isFlipped = Boolean(flippedRow);
return (
  <div
    key={day}
    className={`summit-flip-card h-full ${isFlipped ? "is-flipped" : ""}`}
  >
    <div className="summit-flip-inner h-full">
      <div
        className="summit-flip-face summit-flip-front summit-notebook-sheet p-8 pl-14 relative h-full"
        aria-hidden={isFlipped}
      >
        <div className="summit-notebook-margin-rail" aria-hidden />
        <h3 className="font-headline text-3xl mb-1 text-uxsg-ink relative z-10">{day}</h3>
        <p className="font-hand text-lg text-neutral-700 mb-2 relative z-10">{hours}</p>
        <p className="font-body text-uxsg-rsvp font-bold mb-8 italic relative z-10">
          Theme: &ldquo;{theme}&rdquo;
        </p>
        <div className="relative z-10">
          {rows.map((row) => {
            const key = agendaRowKey(row);
            const clickable = hasAgendaDetails(row);
            const rowContent = (
              <>
                <span className="font-hand shrink-0 text-neutral-700">{row.time}</span>
                <div className="text-left min-w-0 sm:max-w-[min(100%,22rem)]">
                  <span className="block font-bold">{row.title}</span>
                  {row.facilitator ? (
                    <span className="block font-body text-sm text-muted-foreground mt-0.5">
                      {row.facilitator}
                    </span>
                  ) : null}
                </div>
              </>
            );
            return clickable ? (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setFlippedRowByDay((prev) => ({ ...prev, [day]: key }))
                }
                className="summit-notebook-row summit-notebook-row--clickable w-full flex flex-col sm:flex-row gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600 text-left"
              >
                {rowContent}
                <span
                  aria-hidden
                  className="summit-detail-pill font-hand sm:ml-auto self-start mt-1 sm:mt-0 shrink-0"
                >
                  <HandDrawnHighlightSVG className="summit-button-highlight" />
                  <span className="relative z-[1]">detail →</span>
                </span>
                <span className="sr-only">View session details</span>
              </button>
            ) : (
              <div
                key={key}
                className="summit-notebook-row flex flex-col sm:flex-row gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600"
              >
                {rowContent}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="summit-flip-face summit-flip-back summit-notebook-sheet p-8 pl-14 relative"
        aria-hidden={!isFlipped}
      >
        <div className="summit-notebook-margin-rail" aria-hidden />
        <button
          type="button"
          onClick={() =>
            setFlippedRowByDay((prev) => ({ ...prev, [day]: null }))
          }
          className="summit-back-to-agenda font-hand text-base mb-8 relative z-10"
        >
          <HandDrawnHighlightSVG className="summit-button-highlight" />
          <span className="relative z-[1]">← Back to agenda</span>
        </button>
        {flippedRow ? (
          <div className="relative z-10">
            <p className="font-hand text-lg text-neutral-700 mb-1">
              {flippedRow.time}
            </p>
            <h3 className="font-headline text-2xl mb-2 text-uxsg-ink">
              {flippedRow.title}
            </h3>
            {flippedRow.facilitator ? (
              <p className="font-body text-sm text-muted-foreground mb-4 italic">
                with {flippedRow.facilitator}
              </p>
            ) : null}
            {flippedRow.details?.description ? (
              <p className="font-body text-base text-foreground/90 mb-4 whitespace-pre-line">
                {flippedRow.details.description}
              </p>
            ) : null}
            {flippedRow.details?.outcomes && flippedRow.details.outcomes.length > 0 ? (
              <>
                <p className="font-body font-bold text-sm uppercase tracking-wide text-uxsg-ink mb-2">
                  You&rsquo;ll leave with
                </p>
                <ul className="font-body text-base text-foreground/90 list-disc pl-5 space-y-1">
                  {flippedRow.details.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  </div>
);
```

## 4. CSS (`src/index.css`)

```css
.summit-notebook-row--clickable {
  cursor: pointer;
  background: transparent;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  transition: background-color 0.15s ease;
}
.summit-notebook-row--clickable:focus-visible {
  outline: none;
}

/* `.summit-back-to-agenda` shared the base style block with `.summit-detail-pill`. */
.summit-back-to-agenda {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.4rem;
  font-size: 0.95rem;
  line-height: 1.2;
  color: var(--uxsg-rsvp);
  background-color: transparent;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  transition: color 0.15s ease, transform 0.15s ease;
}
.summit-back-to-agenda:hover,
.summit-back-to-agenda:focus-visible {
  color: var(--uxsg-ink);
  text-decoration: none;
  transform: translateX(-2px);
  outline: none;
}
.summit-back-to-agenda:hover .summit-button-highlight,
.summit-back-to-agenda:focus-visible .summit-button-highlight {
  opacity: 1;
}
.summit-notebook-row--clickable:hover .summit-detail-pill,
.summit-notebook-row--clickable:focus-visible .summit-detail-pill {
  color: var(--uxsg-ink);
  text-decoration: none;
  transform: translateX(2px);
}
.summit-notebook-row--clickable:hover .summit-detail-pill .summit-button-highlight,
.summit-notebook-row--clickable:focus-visible .summit-detail-pill .summit-button-highlight {
  opacity: 1;
}

/* Summit 2026 — agenda card flip */
.summit-flip-card {
  perspective: 1600px;
}
.summit-flip-inner {
  position: relative;
  width: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0.05, 0.2, 1);
  transform-style: preserve-3d;
}
.summit-flip-card.is-flipped .summit-flip-inner {
  transform: rotateY(180deg);
}
.summit-flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  isolation: isolate;
}
.summit-flip-front {
  /* Force its own 3D context so backface-visibility applies to children. */
  transform: rotateY(0deg);
  transition: opacity 0s linear 0.35s, visibility 0s linear 0.35s;
}
.summit-flip-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  overflow-y: auto;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0s linear 0.35s, visibility 0s linear 0.35s;
}
.summit-flip-card.is-flipped .summit-flip-front {
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}
.summit-flip-card.is-flipped .summit-flip-back {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  transition: opacity 0s linear 0.35s, visibility 0s linear 0.35s;
}
```
