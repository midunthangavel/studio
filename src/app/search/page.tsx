
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ListFilter, Search, Star } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';

const searchResults: (Omit<VenueCardProps, 'guestFavorite' | 'isCard' | 'imageClassName' | 'className' | 'actionButton'> & { category: string })[] = [
    {
        name: "Urban Chic Loft",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 150,
        price: "$6,000",
        image: "https://placehold.co/600x200.png",
        category: "Venues",
        hint: "urban loft"
    },
    {
        name: "Gourmet Delights Catering",
        location: "Chicago, IL",
        rating: 4.8,
        reviewCount: 90,
        price: "$100/person",
        image: "https://placehold.co/600x200.png",
        category: "Catering",
        hint: "catering food"
    },
    {
        name: "Sunset Beach Resort",
        location: "Miami, FL",
        rating: 4.7,
        reviewCount: 210,
        price: "$8,500",
        image: "https://placehold.co/600x200.png",
        category: "Venues",
        hint: "beach resort"
    },
    {
        name: "Timeless Moments Photography",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 300,
        price: "$2,500",
        image: "https://placehold.co/600x200.png",
        category: "Photography",
        hint: "wedding photography"
    },
    {
        name: "The Royal Ballroom",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 180,
        price: "$12,000",
        image: "https://placehold.co/600x200.png",
        category: "Venues",
        hint: "luxury ballroom"
    },
     {
        name: "Elite Event Staffing",
        location: "Las Vegas, NV",
        rating: 4.9,
        reviewCount: 75,
        price: "Varies",
        image: "https://placehold.co/600x200.png",
        category: "Event Staff",
        hint: "event staff serving"
    },
];

export default function SearchPage() {
    const [priceRange, setPriceRange] = useState([500, 15000]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                           <h3 className="flex items-center text-lg font-semibold mb-6">
                               <ListFilter className="w-5 h-5 mr-2" />
                               Filters
                           </h3>
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
                                            <SelectItem value="decorators">Decorators</SelectItem>
                                            <SelectItem value="catering">Catering</SelectItem>
                                            <SelectItem value="photography">Photography</SelectItem>
                                            <SelectItem value="staff">Event Staff</SelectItem>
                                            <SelectItem value="transport">Transportation</SelectItem>
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
                        </CardContent>
                    </Card>
                </aside>

                {/* Search Results */}
                <main className="lg:col-span-3">
                    <h1 className="text-3xl font-bold mb-1 font-headline">Search Results</h1>
                    <p className="text-muted-foreground mb-6">Showing {searchResults.length} results for your special day.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {searchResults.map((item) => (
                             <VenueCard 
                                key={item.name} 
                                {...item}
                                actionButton={
                                    <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-full">
                                        <Star className="w-5 h-5 text-accent fill-accent" />
                                    </div>
                                }
                                >
                                     <p className='text-sm text-primary font-semibold my-1'>{item.category}</p>
                             </VenueCard>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
