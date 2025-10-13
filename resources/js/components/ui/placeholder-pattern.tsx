import { useId, useState } from "react";

interface PlaceholderPatternProps {
  className?: string;
}

export function PlaceholderPattern({ className }: PlaceholderPatternProps) {
  const patternId = useId();
  const gradientId = `${patternId}-gradient`;
  const [hovered, setHovered] = useState(false);

  const darkYellow = "#D4A017";
  const darkPink = "#C2185B";

  return (
    <div
      className="w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className={className} fill="none">
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={darkYellow}>
              {hovered && (
                <animate
                  attributeName="stop-color"
                  values={`${darkYellow};${darkPink};${darkYellow}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={darkPink}>
              {hovered && (
                <animate
                  attributeName="stop-color"
                  values={`${darkPink};${darkYellow};${darkPink}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>

          <pattern
            id={patternId}
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.2"
              strokeOpacity="0.5"
              fill="none"
            />
          </pattern>
        </defs>

        <rect fill={`url(#${patternId})`} width="100%" height="100%" />
      </svg>
    </div>
  );
}
