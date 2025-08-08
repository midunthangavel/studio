
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ListFilter, Heart, Search, Building2, Paintbrush, UtensilsCrossed, Camera, Car, FileText, Music, Mail, UserCheck, Map, List } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { Filters } from '@/components/search/filters';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const router = useRouter();
    const [viewMode, setViewMode] = useState('list');
    const hasSearched = searchParams && searchParams.toString().length > 0;
    
    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', value);
        router.push(`/search?${params.toString()}`);
    };

    const CategoryGrid = () => (
        <div className="grid grid-cols-3 gap-3">
            {categories.map(category => (
                <Link href={`/search?category=${category.query}`} key={category.name}>
                    <Card className="flex flex-col items-center justify-center p-2 aspect-square text-center hover:bg-muted transition-colors">
                        <category.icon className="w-6 h-6 mb-1 text-primary" />
                        <p className="text-xs font-semibold">{category.name}</p>
                    </Card>
                </Link>
            ))}
        </div>
    );

    const MapViewPlaceholder = () => (
        <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <div className='text-center'>
                <Map className='w-12 h-12 text-muted-foreground mx-auto mb-2' />
                <p className='text-muted-foreground'>Map view coming soon!</p>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <aside className="hidden md:block md:col-span-1">
                    <Card className="p-4 sticky top-20">
                       <h2 className="text-base font-semibold mb-4">Filters</h2>
                       <Filters />
                    </Card>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    <div className='flex justify-between items-center mb-4 gap-4'>
                         <div>
                            <h1 className="text-2xl font-bold font-headline">{hasSearched ? "Search Results" : "Explore Categories"}</h1>
                             {hasSearched && <p className="text-muted-foreground text-sm">Showing {searchResults.length} results.</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            {hasSearched && (
                                <Select onValueChange={handleSortChange} defaultValue={searchParams.get('sortBy') || 'relevance'}>
                                    <SelectTrigger className="w-[180px] h-9 text-xs hidden sm:flex">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                        <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <div className='bg-muted p-0.5 rounded-lg flex'>
                                <Button variant={viewMode === 'list' ? 'outline' : 'ghost'} size='icon' className='h-8 w-8 bg-background shadow-sm' onClick={() => setViewMode('list')}>
                                    <List className='w-4 h-4' />
                                </Button>
                                <Button variant={viewMode === 'map' ? 'outline' : 'ghost'} size='icon' className='h-8 w-8' onClick={() => setViewMode('map')}>
                                    <Map className='w-4 h-4' />
                                </Button>
                            </div>
                            <div className="md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className='h-9 w-9'>
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
                    </div>
                   
                    {!hasSearched && <CategoryGrid />}
                    
                    {hasSearched && viewMode === 'list' && searchResults.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {searchResults.map((item) => {
                                const favorited = isFavorited(item.slug);
                                return (
                                <Link href={`/venues/${item.slug}`} key={item.slug}>
                                    <VenueCard 
                                        {...item}
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
                                                    toggleFavorite(item)
                                                }}
                                            >
                                                <Heart className={cn("w-4 h-4", favorited && "fill-primary text-primary")} />
                                            </Button>
                                        }
                                        >
                                            <p className='text-xs text-primary font-semibold my-1 capitalize'>{item.category}</p>
                                    </VenueCard>
                                </Link>
                            )})}
                        </div>
                    )}
                    
                    {hasSearched && viewMode === 'map' && <MapViewPlaceholder />}

                    {hasSearched && searchResults.length === 0 && (
                         <div className="border-dashed border rounded-lg">
                            <div className="p-8 text-center">
                                <div className="mx-auto w-fit bg-secondary p-3 rounded-full mb-3">
                                <Search className="w-7 h-7 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">No Results Found</h3>
                                <p className="text-muted-foreground text-sm">
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
