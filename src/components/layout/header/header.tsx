
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "./theme-toggle";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";
import { SearchResults } from "@/components/home/search-results";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "./notifications-popover";


export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(VenueCardProps & { category: string; })[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);


  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchQuery(query);

    if (query.trim() !== '') {
        const results = allVenues.filter(venue => 
            venue.name.toLowerCase().includes(query.toLowerCase()) ||
            venue.location.toLowerCase().includes(query.toLowerCase()) ||
            venue.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setShowResults(true);
    } else {
        setSearchResults([]);
        setShowResults(false);
    }
  }

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setShowResults(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!isHomePage || currentScrollY < 50) {
        setIsScrolled(false);
      } else if (currentScrollY > 50) {
        setIsScrolled(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).closest('header')) return;
      setShowResults(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-auto flex-col justify-center gap-4 py-3">
        {/* Top: Logo & Actions */}
        <div className="flex items-center gap-4">
           <Link href="/home" className="md:hidden">
                <AppLogo className="text-2xl" />
          </Link>
          <div className="flex-grow">
             <div className="hidden md:block">
                {!isHomePage && (
                     <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search venues, caterers, and more..."
                            className="w-full rounded-full bg-muted pl-12 h-10 text-base"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                         {showResults && !isHomePage && (
                            <SearchResults 
                                results={searchResults} 
                                query={searchQuery}
                                onClose={() => setShowResults(false)} 
                            />
                        )}
                    </div>
                )}
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" asChild>
                <Link href="/chat">
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Messages</span>
                </Link>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <NotificationsPopover />
              </PopoverContent>
            </Popover>
            <ThemeToggle />
            {user ? (
              <>
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
            ) : null}
          </div>
        </div>

        {isHomePage && (
           <div className="w-full flex flex-col gap-4">
             <div className={cn(
                "w-full transition-all duration-300 ease-in-out overflow-hidden",
                isScrolled ? "h-0 opacity-0" : "h-16 opacity-100"
              )}>
                 <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage src={user?.photoURL ?? undefined} />
                        <AvatarFallback>{user?.displayName?.[0] || 'G'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-lg">Welcome, {user?.displayName?.split(' ')[0] || 'Guest'}!</h2>
                        <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>New York, NY (Current)</span>
                        </div>
                    </div>
                 </div>
             </div>
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search venues, caterers, and more..."
                    className="w-full rounded-full bg-muted pl-12 h-14 text-base shadow-sm focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    onFocus={handleSearchChange}
                />
                 {showResults && (
                    <SearchResults 
                        results={searchResults} 
                        query={searchQuery}
                        onClose={() => setShowResults(false)} 
                    />
                )}
            </div>
           </div>
        )}
      </div>
    </header>
  );
}
