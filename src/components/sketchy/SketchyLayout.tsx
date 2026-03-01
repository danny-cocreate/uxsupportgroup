import { Outlet } from "react-router-dom";
import { SketchyHeader } from "@/components/sketchy/SketchyHeader";
import { SketchyFooter } from "@/components/sketchy/SketchyFooter";

export const SketchyLayout = () => (
  <>
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="roughen">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise" seed="1" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
    </svg>
    <SketchyHeader />
    <div className="min-h-screen paper-bg font-body">
      <a
        href="#main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:p-4 focus:rounded focus:bg-uxsg-ink focus:text-white focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:[clip:auto]"
      >
        Skip to main content
      </a>
      <Outlet />
    </div>
    <SketchyFooter />
  </>
);

export default SketchyLayout;
