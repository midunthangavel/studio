
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ListFilter, Heart, Search, Hotel, PartyPopper, ChefHat, Video, CarFront, ScrollText, Disc3, Mailbox, ClipboardList } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { Filters } from '@/components/search/filters';
import { Card } from '@/components/ui/card';

const categories = [
    { name: "Venues", icon: Hotel, query: "venue" },
    { name: "Decorations", icon: PartyPopper, query: "decorations" },
    { name: "Catering", icon: ChefHat, query: "catering" },
    { name: "Photography", icon: Video, query: "photography" },
    { name: "Transport", icon: CarFront, query: "transport" },
    { name: "Legal", icon: ScrollText, query: "legal" },
    { name: "Music/DJ", icon: Disc3, query: "music" },
    { name: "Invitations", icon: Mailbox, query: "invitations" },
    { name: "Event Planners", icon: ClipboardList, query: "planner" },
];

const CategoryGrid = () => (
    <div className="grid grid-cols-3 gap-4">
        {categories.map(category => (
            <Link href={`/search?q=${category.query}`} key={category.name}>
                <Card className="flex flex-col items-center justify-center p-4 aspect-square text-center hover:bg-muted transition-colors">
                    <category.icon className="w-8 h-8 mb-2 text-primary" />
                    <p className="text-sm font-semibold">{category.name}</p>
                </Card>
            </Link>
        ))}
    </div>
);

export function SearchPageClient({ searchResults, hasSearched }: { searchResults: (VenueCardProps & { category: string })[], hasSearched: boolean }) {
    const { isFavorited, toggleFavorite } = useFavorites();

    return (
        <div className="container mx-auto px-4 pt-8">
            <main>
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{hasSearched ? "Search Results" : "Explore"}</h1>
                        {hasSearched && <p className="text-muted-foreground">Showing {searchResults.length} results.</p>}
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

                {!hasSearched && <CategoryGrid />}
                
                {hasSearched && searchResults.length > 0 && (
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
                )}
                {hasSearched && searchResults.length === 0 && (
                    <div className="border-dashed border rounded-lg">
                        <div className="p-10 text-center">
                            <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                            <p className="text-muted-foreground">
                            We couldn't find anything matching your search. Try a different term.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
