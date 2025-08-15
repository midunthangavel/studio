
interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AppLogo({ width = 100, height = 25, className }: AppLogoProps) {
  return (
    <div className={className} style={{ width, height }}>
       <svg
        viewBox="0 0 450 60"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="45"
          fontFamily="'Poppins', sans-serif"
          fontSize="48"
          fontWeight="bold"
        >
          <tspan className="fixmy-text">Fixmy</tspan>
          <tspan className="event-text">event</tspan>
        </text>
      </svg>
    </div>
  );
}
