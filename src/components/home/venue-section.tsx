
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { VenueCard } from "@/components/venue-card";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart, Plus } from "lucide-react";
import type { Listing } from "@/services/listings";

export const VenueSection = ({ title, venues, moreLink }: { title: string, venues: Listing[], moreLink?: string }) => {
    const { isFavorited, toggleFavorite } = useFavorites();

    return (
        <section className="py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold font-headline">
                        {title}
                    </h2>
                    {moreLink && (
                        <Button variant="link" asChild className="text-primary text-sm">
                            <Link href={moreLink}>
                                See all <Plus className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="-mx-2">
                     <Carousel opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                     }}>
                        <CarouselContent>
                            {venues.map((venue, index) => {
                                const favorited = isFavorited(venue.slug);
                                return (
                                <CarouselItem key={venue.slug} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <div className="p-2">
                                    <Link href={`/venues/${venue.slug}`} passHref>
                                        <VenueCard
                                            {...venue}
                                            isCard
                                            imageClassName="h-40"
                                            actionButton={
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full h-7 w-7"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(venue)
                                                    }}
                                                >
                                                    <Heart className={cn("w-3.5 h-3.5", favorited && "fill-primary text-primary")} />
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
