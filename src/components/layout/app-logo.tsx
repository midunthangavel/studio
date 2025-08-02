
import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("font-bold font-headline", className)}>
      <span className="text-[#F04438]">Fixmy</span>
      <span className="text-[#FDB022]">Event</span>
    </div>
  );
}
