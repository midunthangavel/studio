
'use client';

import { VenueSection } from "@/components/home/venue-section";
import { allVenues } from "@/lib/venues";
import type { VenueCardProps } from "@/components/venue-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col">
       <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search for venues, catering, and more..."
                className="w-full h-14 rounded-full bg-muted pl-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </form>
       </div>
      
      <div className="py-6">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
    </div>
  );
}
