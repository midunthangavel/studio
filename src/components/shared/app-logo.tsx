
interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AppLogo({ width = 100, height = 25, className }: AppLogoProps) {
  return (
    <div className={className} style={{ width, height }}>
      <svg
        viewBox="0 0 170 28"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <style>
          {`
            .venue-text { fill: hsl(var(--primary)); }
            .voyager-text { fill: hsl(var(--accent)); }
          `}
        </style>
        <text
          x="0"
          y="22"
          fontFamily="'Playfair Display', serif"
          fontSize="24"
          fontWeight="bold"
          className="venue-text"
        >
          Venue
          <tspan className="voyager-text">Voyager</tspan>
        </text>
      </svg>
    </div>
  );
}
