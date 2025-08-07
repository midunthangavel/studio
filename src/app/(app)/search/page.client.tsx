
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ListFilter, Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { Filters } from '@/components/search/filters';

export function SearchPageClient({ searchResults }: { searchResults: (VenueCardProps & { category: string })[] }) {
    const { isFavorited, toggleFavorite } = useFavorites();

    return (
        <div className="container mx-auto px-4 py-12">
             <div className="grid grid-cols-1 gap-8">
                <main>
                    <div className='flex justify-between items-center mb-6'>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">Search Results</h1>
                            <p className="text-muted-foreground">Showing {searchResults.length} results.</p>
                        </div>
                        <div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <ListFilter className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[80vh] flex flex-col">
                                     <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                     <div className="py-4 overflow-y-auto">
                                        <Filters />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {searchResults.map((item) => {
                            const favorited = isFavorited(item.slug);
                            return (
                             <Link href={`/venues/${item.slug}`} key={item.name}>
                                <VenueCard 
                                    isCard
                                    {...item}
                                    imageClassName="h-64"
                                    actionButton={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(item)
                                            }}
                                        >
                                            <Heart className={cn("w-5 h-5", favorited && "fill-primary text-primary")} />
                                        </Button>
                                    }
                                    >
                                        <p className='text-sm text-primary font-semibold my-1'>{item.category}</p>
                                </VenueCard>
                            </Link>
                        )})}
                    </div>
                </main>
            </div>
        </div>
    );
}
