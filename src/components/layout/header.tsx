
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { WelcomeMessage } from "./welcome-message";
import { HeaderNavigation } from "./header-navigation";
import { usePathname } from "next/navigation";
import { AppLogo } from "./app-logo";


export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-auto flex-col justify-center gap-4 py-3">
        {/* Top: Search Bar & Actions */}
        <div className="flex items-center gap-4">
           <Link href="/home" className="hidden md:block">
                <AppLogo className="text-2xl" />
          </Link>
          <div className="flex-grow">
             {pathname === '/home' && <WelcomeMessage />}
            <div className="relative md:w-auto md:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Start your search"
                className="w-full rounded-full bg-muted pl-10 h-12 shadow-md focus-visible:ring-primary"
                />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/planner">Become a host</Link>
            </Button>
            <Button size="icon" variant="ghost" asChild>
                <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Link>
            </Button>
          </div>
        </div>
        {/* Bottom: Navigation */}
        <HeaderNavigation />
      </div>
    </header>
  );
}
