
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, LogOut, Search, User, MessageSquare } from "lucide-react";
import { WelcomeMessage } from "./welcome-message";
import { HeaderNavigation } from "./header-navigation";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "./app-logo";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle";


export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

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
            <ThemeToggle />
            {user ? (
              <>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL ?? undefined} />
                       <AvatarFallback>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                     </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/bookings')}>
                    <Bell className="mr-2" />
                    Bookings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
               <Button size="icon" variant="ghost" asChild>
                  <Link href="/chat">
                      <MessageSquare className="h-5 w-5" />
                      <span className="sr-only">Messages</span>
                  </Link>
              </Button>
              <Button size="icon" variant="ghost" asChild>
                  <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">Notifications</span>
                  </Link>
              </Button>
              </>
            ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
            )}
          </div>
        </div>
        {/* Bottom: Navigation */}
        <HeaderNavigation />
      </div>
    </header>
  );
}
