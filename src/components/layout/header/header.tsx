
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User, MessageSquare } from "lucide-react";
import { HeaderNavigation } from "./header-navigation";
import { useRouter } from "next/navigation";
import { AppLogo } from "./app-logo";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
             <div className="hidden md:block">
              {/* The welcome message is now on the home page */}
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href="#">Become a host</Link>
            </Button>
            <ThemeToggle />
            {user ? (
              <>
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
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/bookings')}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Bookings</span>
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => router.push('/chat')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
            )}
          </div>
        </div>
        {/* Bottom: Navigation */}
        <div className="hidden md:flex md:justify-center">
            <HeaderNavigation />
        </div>
      </div>
    </header>
  );
}
