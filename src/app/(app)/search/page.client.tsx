
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filters */}
                <aside className="hidden lg:block col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Filters</h3>
                             <Filters />
                        </CardContent>
                    </Card>
                </aside>
                {/* Search Results */}
                <main className='lg:col-span-3'>
                    <div className='flex justify-between items-center mb-6'>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">Search Results</h1>
                            <p className="text-muted-foreground">Showing {searchResults.length} results for your special day.</p>
                        </div>
                        <div className="lg:hidden">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
