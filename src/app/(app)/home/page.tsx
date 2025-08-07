
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
    <div className="relative flex flex-col py-6">
       <div className="container mx-auto px-4">
            <div className="hidden md:block">
                <WelcomeHeader />
            </div>
            <div className="relative w-full mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search venues, caterers, and more..."
                    className="w-full rounded-full bg-muted pl-12 h-14 text-base shadow-inner focus-visible:ring-primary"
                />
            </div>
      </div>
      <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
      <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search?location=Miami" />
    </div>
  );
}
