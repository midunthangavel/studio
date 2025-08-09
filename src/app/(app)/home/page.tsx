
'use client';

import { VenueSection } from "@/components/home/venue-section";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
    </div>
  );
}
