
import { Playfair_Display } from 'next/font/google';
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-headline',
});

export function AppLogo() {
  return (
    <h1 className={cn("font-headline text-2xl font-bold", playfair.variable)}>
      <span className="text-primary">Venue</span>
      <span className="text-accent">Voyager</span>
    </h1>
  );
}
