
'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WelcomeHeader } from "@/components/home/welcome-header";
import { VenueSection } from "@/components/home/venue-section";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);

export default function HomePage() {
  return (
    <div className="flex flex-col">
       <div className="bg-muted/50 pb-8 pt-6">
        <div className="container mx-auto px-4">
              <WelcomeHeader />
              <div className="relative w-full mt-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search venues, caterers, and more..."
                      className="w-full rounded-full bg-background pl-12 h-14 text-base shadow-sm focus-visible:ring-primary"
                  />
              </div>
        </div>
       </div>
      <div className="py-6">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search?location=Miami" />
      </div>
    </div>
  );
}
