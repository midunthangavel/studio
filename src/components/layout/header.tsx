import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain, Bell, MessageSquare } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline">
              VenueVoyager
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/search"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Search
            </Link>
            <Link
              href="/planner"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              AI Planner
            </Link>
            <Link
              href="/favorites"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Favorites
            </Link>
            <Link
              href="/bookings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Bookings
            </Link>
          </nav>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                    <Mountain className="h-6 w-6" />
                    <span className="font-bold font-headline">VenueVoyager</span>
                </Link>
                <Link href="/search" className="block px-2 py-1 text-lg">
                  Search
                </Link>
                <Link href="/planner" className="block px-2 py-1 text-lg text-muted-foreground">
                  AI Planner
                </Link>
                <Link href="/favorites" className="block px-2 py-1 text-lg text-muted-foreground">
                  Favorites
                </Link>
                <Link href="/bookings" className="block px-2 py-1 text-lg text-muted-foreground">
                  Bookings
                </Link>
                 <Link href="/notifications" className="block px-2 py-1 text-lg text-muted-foreground">
                  Notifications
                </Link>
                 <Link href="/chat" className="block px-2 py-1 text-lg text-muted-foreground">
                  Chat
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/chat">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
