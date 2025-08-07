import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-bold font-headline", className)}>
      <span className="text-primary">Fix</span>
      <span className="text-accent">myEvent</span>
    </h1>
  );
}
