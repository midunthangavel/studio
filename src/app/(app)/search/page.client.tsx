
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ListFilter, Heart, Search, Building2, Paintbrush, UtensilsCrossed, Camera, Car, FileText, Music, Mail, UserCheck } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { Filters } from '@/components/search/filters';
import { Card } from '@/components/ui/card';
import type { SearchParams } from './page';

const categories = [
    { name: "Venues", icon: Building2, query: "venue" },
    { name: "Decorations", icon: Paintbrush, query: "decorations" },
    { name: "Catering", icon: UtensilsCrossed, query: "catering" },
    { name: "Photography", icon: Camera, query: "photography" },
    { name: "Transport", icon: Car, query: "transport" },
    { name: "Legal", icon: FileText, query: "legal" },
    { name: "Music/DJ", icon: Music, query: "music" },
    { name: "Invitations", icon: Mail, query: "invitations" },
    { name: "Event Planners", icon: UserCheck, query: "planner" },
];

export function SearchPageClient({ searchResults }: { searchResults: (VenueCardProps & { category: string })[] }) {
    const { isFavorited, toggleFavorite } = useFavorites();
    const searchParams = useSearchParams();
    const hasSearched = searchParams && searchParams.toString().length > 0;

    const CategoryGrid = () => (
        <div className="grid grid-cols-3 gap-4">
            {categories.map(category => (
                <Link href={`/search?category=${category.query}`} key={category.name}>
                    <Card className="flex flex-col items-center justify-center p-4 aspect-square text-center hover:bg-muted transition-colors">
                        <category.icon className="w-8 h-8 mb-2 text-primary" />
                        <p className="text-sm font-semibold">{category.name}</p>
                    </Card>
                </Link>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="hidden md:block md:col-span-1">
                    <Card className="p-6 sticky top-24">
                       <h2 className="text-lg font-semibold mb-4">Filters</h2>
                       <Filters />
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    <div className='flex justify-between items-center mb-6'>
                         <div>
                            <h1 className="text-3xl font-bold font-headline">{hasSearched ? "Search Results" : "Explore Categories"}</h1>
                             {hasSearched && <p className="text-muted-foreground">Showing {searchResults.length} results.</p>}
                        </div>
                        <div className="md:hidden">
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
                                        <Filters id="filters-form-mobile" />
                                    </div>
                                    <div className='p-4 border-t'>
                                        <Button className='w-full' form='filters-form-mobile'>Apply Filters</Button>
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
                                <Link href={`/venues/${item.slug}`} key={item.slug}>
                                    <VenueCard 
                                        {...item}
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
                                                    toggleFavorite(item)
                                                }}
                                            >
                                                <Heart className={cn("w-5 h-5", favorited && "fill-primary text-primary")} />
                                            </Button>
                                        }
                                        >
                                            <p className='text-sm text-primary font-semibold my-1 capitalize'>{item.category}</p>
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
                                We couldn't find anything matching your search. Try adjusting your filters.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
