
interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AppLogo({ width = 100, height = 25, className }: AppLogoProps) {
  return (
    <div className={className} style={{ width, height }}>
      <svg
        viewBox="0 0 155 28"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <style>
          {`
            .fixmy-text { fill: hsl(var(--primary)); }
            .event-text { fill: hsl(var(--accent)); }
          `}
        </style>
        <text
          x="0"
          y="22"
          fontFamily="PT Sans, sans-serif"
          fontSize="24"
          fontWeight="bold"
          className="fixmy-text"
        >
          Fixmy
          <tspan className="event-text">event</tspan>
        </text>
      </svg>
    </div>
  );
}
