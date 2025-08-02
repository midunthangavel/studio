
import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("font-bold font-headline", className)}>
      <span className="text-red-500">Fixmy</span>
      <span className="text-yellow-500">Event</span>
    </div>
  );
}
