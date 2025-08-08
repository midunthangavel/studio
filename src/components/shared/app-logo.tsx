
import Image from 'next/image';

interface AppLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AppLogo({ width = 120, height = 40, className }: AppLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.png"
        alt="FixmyEvent Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
