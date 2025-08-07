
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User, MessageSquare, MapPin, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "@/components/shared/app-logo";
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
import { Input } from "@/components/ui/input";


export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-auto flex-col justify-center gap-4 py-3">
        {/* Top: Search Bar & Actions */}
        <div className="flex items-center gap-4">
           <Link href="/home" className="md:hidden">
                <AppLogo className="text-2xl" />
          </Link>
          <div className="flex-grow">
             <div className="hidden md:block">
                {/* Desktop: Show search bar if not home page */}
                {!isHomePage && (
                     <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search venues, caterers, and more..."
                            className="w-full rounded-full bg-muted pl-12 h-10 text-base"
                        />
                    </div>
                )}
             </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Home Page Header Content */}
        {isHomePage && (
           <div className="w-full">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold text-lg">Welcome, {user?.displayName?.split(' ')[0] || 'User'}!</h2>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>New York, NY (Current)</span>
                    </div>
                </div>
            </div>
             <div className="relative w-full mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search venues, caterers, and more..."
                    className="w-full rounded-full bg-muted pl-12 h-14 text-base shadow-sm focus-visible:ring-primary"
                />
            </div>
           </div>
        )}
      </div>
    </header>
  );
}
