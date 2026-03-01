import type { SVGProps } from "react";

export const HandDrawnRect = ({
  fill = "white",
  stroke = "#090907",
  strokeWidth = 2,
  className = "",
}: {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    viewBox="0 0 200 60"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M4,5 C15,3 35,6 60,4 C85,2 120,5 150,3 C175,5 190,3 196,5
         C198,12 197,25 198,35 C197,45 198,52 196,56
         C185,58 170,55 140,57 C110,59 80,55 50,57 C25,59 10,56 4,55
         C2,48 3,35 2,25 C3,15 2,8 4,5 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);
