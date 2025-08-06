
'use client';

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Search,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { VenueCard, VenueCardProps } from "@/components/venue-card";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { allVenues } from "@/lib/venues";

const popularVenues: VenueCardProps[] = allVenues.slice(0, 4);
const availableNextMonth: VenueCardProps[] = allVenues.slice(5, 8);


const WelcomeHeader = () => {
    const { user } = useAuth();
    return (
        <Card className="mb-6 shadow-sm">
            <div className="p-4 flex justify-between items-center">
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
            </div>
        </Card>
    );
}

const VenueSection = ({ title, venues, moreLink }: { title: string, venues: VenueCardProps[], moreLink?: string }) => {
    const { isFavorited, toggleFavorite } = useFavorites();

    return (
        <section className="py-6">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline">
                        {title}
                    </h2>
                    {moreLink && (
                        <Button variant="link" asChild className="text-primary">
                            <Link href={moreLink}>
                                See all <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>
                 {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {venues.map((venue) => {
                        const favorited = isFavorited(venue.slug);
                        return (
                        <Link href={`/venues/${venue.slug}`} key={venue.slug} passHref>
                            <VenueCard
                                {...venue}
                                isCard
                                imageClassName="h-64"
                                actionButton={
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(venue)
                                        }}
                                    >
                                        <Heart className={cn("w-5 h-5", favorited && "fill-primary text-primary")} />
                                    </Button>
                                }
                            />
                        </Link>
                    )})}
                </div>
                 {/* Mobile Carousel */}
                <div className="md:hidden -mx-4">
                     <Carousel opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                     }}>
                        <CarouselContent>
                            {venues.map((venue, index) => {
                                const favorited = isFavorited(venue.slug);
                                return (
                                <CarouselItem key={venue.slug} className="basis-4/5">
                                    <div className="p-1">
                                    <Link href={`/venues/${venue.slug}`} passHref>
                                        <VenueCard
                                            {...venue}
                                            isCard
                                            imageClassName="h-48"
                                            actionButton={
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full h-8 w-8"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(venue)
                                                    }}
                                                >
                                                    <Heart className={cn("w-4 h-4", favorited && "fill-primary text-primary")} />
                                                </Button>
                                            }
                                        />
                                    </Link>
                                    </div>
                                </CarouselItem>
                            )})}
                        </CarouselContent>
                     </Carousel>
                </div>
            </div>
        </section>
    );
}


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
