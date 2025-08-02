
import Link from "next/link";
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
    href: "/search?category=venues",
    active: true
  },
  {
    name: "Experiences",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/planner",
    active: false,
    isNew: true,
  },
  {
    name: "Services",
    icon: <ConciergeBell className="w-6 h-6" />,
    href: "/search?category=services",
    active: false,
    isNew: true
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-28 flex-col justify-center gap-4 max-w-screen-2xl">
        {/* Top: Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Start your search"
              className="w-full rounded-full bg-muted pl-10 h-12 shadow-md focus-visible:ring-primary"
            />
          </div>
        </div>
        {/* Bottom: Navigation */}
        <nav className="flex justify-center items-center gap-10 text-sm">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className={`relative flex flex-col items-center gap-1 transition-colors hover:text-foreground/80 ${
                category.active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {category.icon}
              <span className="text-xs font-medium">{category.name}</span>
              {category.active && (
                <div className="absolute -bottom-2 h-[2px] w-6 bg-foreground rounded-full" />
              )}
               {category.isNew && (
                <div className="absolute top-0 right-0 -mr-2 -mt-1 text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">
                  NEW
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
