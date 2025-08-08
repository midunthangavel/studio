
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AppLogo } from "@/components/shared/app-logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "./theme-toggle";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";
import { NotificationsPopover } from "./notifications-popover";

function SearchResults({ results, onResultClick }: { results: (VenueCardProps & { category: string; })[], onResultClick: () => void }) {
    if (results.length === 0) return null;
    return (
        <div className="absolute top-full left-0 w-full bg-background border rounded-lg mt-1 shadow-lg z-50 max-h-80 overflow-y-auto">
            <ul className="divide-y">
                {results.map(item => (
                    <li key={item.slug}>
                        <Link href={`/venues/${item.slug}`} className="block p-3 hover:bg-muted" onClick={onResultClick}>
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.location} - <span className="text-primary">{item.category}</span></p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(VenueCardProps & { category: string; })[]>([]);
  const [showResults, setShowResults] = useState(false);

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

   const handleResultClick = () => {
    setSearchQuery('');
    setShowResults(false);
  };

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
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
                <AppLogo height={20} />
            </Link>
            {!isHomePage && (
                <div className="relative hidden md:block w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        onFocus={handleSearchChange}
                    />
                    {showResults && <SearchResults results={searchResults} onResultClick={handleResultClick} />}
                </div>
            )}
         </div>
        
        <div className="flex flex-shrink-0 items-center justify-end space-x-1">
           <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <NotificationsPopover />
            </PopoverContent>
           </Popover>
          <Button size="icon" variant="ghost" asChild>
            <Link href="/chat">
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Messages</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
