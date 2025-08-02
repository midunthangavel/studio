
import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("font-bold font-headline", className)}>
      <span className="text-primary">Venue</span>
      <span className="text-accent">Voyager</span>
    </div>
  );
}
