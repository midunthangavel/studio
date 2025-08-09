
'use client';

import { VenueSection } from "@/components/home/venue-section";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InstallPWA } from "@/components/shared/install-pwa";

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
       <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Search for venues, catering, and more..."
                  className="w-full h-12 rounded-full bg-muted pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </form>
        </div>
       </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
      <InstallPWA />
    </div>
  );
}
