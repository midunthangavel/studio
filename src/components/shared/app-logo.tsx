
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AppLogo({ width, height, className }: { width: number; height: number; className?: string }) {
  return (
    <Image
        src="/images/logo.png"
        alt="FixmyEvent Logo"
        width={width}
        height={height}
        className={cn("object-contain", className)}
        priority
    />
  );
}
