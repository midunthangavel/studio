
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ListFilter, Search, Star, Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { allVenues } from '@/lib/venues';

const searchResults = allVenues;

export default function SearchPage() {
    const [priceRange, setPriceRange] = useState([500, 15000]);
    const { isFavorited, toggleFavorite } = useFavorites();

    const Filters = () => (
        <form className="space-y-6">
            <div>
                <Label htmlFor="keyword">Keyword or Name</Label>
                <Input id="keyword" placeholder="e.g., Lakeside, Royal" />
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., New York, NY" />
            </div>
            <div>
                <Label htmlFor="category">Service Type</Label>
                <Select>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="venues">Venues</SelectItem>
                        <SelectItem value="decorations">Decorations</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="staff">Event Staff</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Price Range</Label>
                <Slider
                    min={0}
                    max={30000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
            <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
            </Button>
        </form>
    );

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

    
