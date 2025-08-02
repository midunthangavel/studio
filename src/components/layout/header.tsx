
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Home,
  Sparkles,
  ConciergeBell,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const categories = [
  {
    name: "Homes",
    icon: <Home className="w-6 h-6" />,
    href: "/home",
  },
   {
    name: "Search",
    icon: <Search className="w-6 h-6" />,
    href: "/search",
  },
  {
    name: "Experiences",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/planner",
    isNew: true,
  },
  {
    name: "Services",
    icon: <ConciergeBell className="w-6 h-6" />,
    href: "/search?category=services",
    isNew: true
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-28 flex-col justify-center gap-4 max-w-screen-2xl">
        {/* Top: Search Bar */}
        <div className="flex items-center gap-4">
           <Link href="/home" className="font-bold text-lg text-primary font-headline hidden md:block">
            VenueVoyager
          </Link>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Start your search"
              className="w-full rounded-full bg-muted pl-10 h-12 shadow-md focus-visible:ring-primary"
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/planner">Become a host</Link>
            </Button>
            <ThemeToggle />
            <Button size="icon" variant="ghost">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
        {/* Bottom: Navigation */}
        <nav className="flex justify-center items-center gap-10 text-sm">
          {categories.map((category) => {
            const isActive = pathname === category.href;
            return (
                <Link
                href={category.href}
                key={category.name}
                className={`relative flex flex-col items-center gap-1 transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {category.icon}
                <span className="text-xs font-medium flex items-center gap-1">
                    {category.name}
                    {category.isNew && (
                        <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 h-[2px] w-6 bg-foreground rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  );
}
