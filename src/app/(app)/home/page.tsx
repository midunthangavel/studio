
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

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
       <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
            <Link href="/profile">
                <Avatar className="h-12 w-12">
                     <AvatarImage src={user?.photoURL ?? undefined} />
                     <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </Link>
            <div>
                <p className="text-muted-foreground text-sm">Welcome back,</p>
                <h2 className="text-lg font-bold">{user?.displayName || 'User'}!</h2>
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span>New York, NY</span>
        </div>
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search for venues, catering, and more..."
                className="w-full h-14 rounded-full bg-muted pl-12 text-base"
            />
        </div>
       </div>
      
      <div className="py-6">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
    </div>
  );
}
