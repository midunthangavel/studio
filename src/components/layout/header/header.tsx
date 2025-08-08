
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User, MessageSquare } from "lucide-react";
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
import { HeaderNavigation } from "./header-navigation";
import { useEffect, useState } from "react";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";
import { NotificationsPopover } from "./notifications-popover";

function SearchResults({ results }: { results: (VenueCardProps & { category: string; })[] }) {
    if (results.length === 0) return null;
    return (
        <div className="absolute top-full left-0 w-full bg-background border rounded-lg mt-2 shadow-lg z-50 max-h-96 overflow-y-auto">
            <ul className="divide-y">
                {results.map(item => (
                    <li key={item.slug}>
                        <Link href={`/venues/${item.slug}`} className="block p-4 hover:bg-muted">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.location} - <span className="text-primary">{item.category}</span></p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';
  const isSearchPage = pathname === '/search';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(VenueCardProps & { category: string; })[]>([]);
  const [showResults, setShowResults] = useState(false);

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
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).closest('header')) return;
      setShowResults(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo width={120} height={40} />
          </Link>
          <HeaderNavigation />
        </div>
        
        <div className="relative flex-1">
          {(!isHomePage && !isSearchPage) && (
              <>
                 <Input
                    type="search"
                    placeholder="Search..."
                    className="h-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    onFocus={handleSearchChange}
                />
                {showResults && <SearchResults results={searchResults} />}
              </>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
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
          <Button size="icon" variant="ghost" asChild>
            <Link href="/chat">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
            </Link>
          </Button>
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
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
       {(isHomePage || isSearchPage) && (
         <div className="container pb-4">
             <div className="relative mt-2">
                 <Input
                    type="search"
                    placeholder="Search for venues, catering, and more..."
                    className="w-full h-12 rounded-full bg-muted pl-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    onFocus={handleSearchChange}
                />
                {showResults && <SearchResults results={searchResults} />}
             </div>
        </div>
      )}
    </header>
  );
}
