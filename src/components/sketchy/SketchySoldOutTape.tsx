import { cn } from "@/lib/utils";

type SketchySoldOutTapeProps = {
  className?: string;
  /** Slight tilt variation so stacked cards do not look identical. */
  rotation?: "left" | "right" | "slight";
};

const ROTATION_CLASS: Record<NonNullable<SketchySoldOutTapeProps["rotation"]>, string> = {
  left: "-rotate-[11deg]",
  right: "rotate-[9deg]",
  slight: "-rotate-[6deg]",
};

/** Diagonal masking-tape banner for sold-out pricing cards. */
export const SketchySoldOutTape = ({
  className,
  rotation = "left",
}: SketchySoldOutTapeProps) => (
  <div
    className={cn(
      "pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden",
      className,
    )}
    role="status"
    aria-label="Sold out"
  >
    <div
      className={cn(
        "absolute left-1/2 top-[42%] w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2",
        ROTATION_CLASS[rotation],
      )}
      style={{ filter: "url(#roughen)" }}
    >
      <div className="border-[1.5px] border-uxsg-ink/30 bg-[color:var(--uxsg-tape)] px-8 py-3 text-center shadow-[2px_3px_0_0_rgba(9,9,7,0.35)] sm:px-10 sm:py-4">
        <span className="font-hand text-3xl font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_0_rgba(9,9,7,0.45)] sm:text-4xl">
          Sold out
        </span>
      </div>
    </div>
  </div>
);
