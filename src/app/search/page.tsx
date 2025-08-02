
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, ListFilter, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

const searchResults = [
    {
        name: "Urban Chic Loft",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 150,
        price: "$6,000",
        image: "https://placehold.co/600x400.png",
        category: "Venues",
        hint: "urban loft"
    },
    {
        name: "Gourmet Delights Catering",
        location: "Chicago, IL",
        rating: 4.8,
        reviewCount: 90,
        price: "$100/person",
        image: "https://placehold.co/600x400.png",
        category: "Catering",
        hint: "catering food"
    },
    {
        name: "Sunset Beach Resort",
        location: "Miami, FL",
        rating: 4.7,
        reviewCount: 210,
        price: "$8,500",
        image: "https://placehold.co/600x400.png",
        category: "Venues",
        hint: "beach resort"
    },
    {
        name: "Timeless Moments Photography",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 300,
        price: "$2,500",
        image: "https://placehold.co/600x400.png",
        category: "Photography",
        hint: "wedding photography"
    },
    {
        name: "The Royal Ballroom",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 180,
        price: "$12,000",
        image: "https://placehold.co/600x400.png",
        category: "Venues",
        hint: "luxury ballroom"
    },
     {
        name: "DJ Spark",
        location: "Las Vegas, NV",
        rating: 4.9,
        reviewCount: 75,
        price: "$800",
        image: "https://placehold.co/600x400.png",
        category: "Music",
        hint: "dj setup"
    },
];

export default function SearchPage() {
    const [priceRange, setPriceRange] = useState([500, 10000]);

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
                                   <Label htmlFor="keyword">Keyword</Label>
                                   <Input id="keyword" placeholder="e.g., Rustic Barn" />
                               </div>
                               <div>
                                   <Label htmlFor="location">Location</Label>
                                   <Input id="location" placeholder="e.g., New York, NY" />
                               </div>
                               <div>
                                   <Label htmlFor="category">Category</Label>
                                   <Select>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="venues">Venues</SelectItem>
                                            <SelectItem value="catering">Catering</SelectItem>
                                            <SelectItem value="photography">Photography</SelectItem>
                                            <SelectItem value="music">Music</SelectItem>
                                            <SelectItem value="decorations">Decorations</SelectItem>
                                            <SelectItem value="transport">Transport</SelectItem>
                                        </SelectContent>
                                    </Select>
                               </div>
                                <div>
                                    <Label>Price Range</Label>
                                    <Slider
                                        min={0}
                                        max={20000}
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
                    <h1 className="text-3xl font-bold mb-6 font-headline">Search Results</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((item) => (
                             <Card key={item.name} className="overflow-hidden group">
                                <div className="relative">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={item.hint}
                                />
                                <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-full">
                                    <Star className="w-5 h-5 text-accent fill-accent" />
                                </div>
                                </div>
                                <CardContent className="p-4">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className='text-sm text-primary font-semibold my-1'>{item.category}</p>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {item.location}
                                </div>
                                <div className="flex items-center text-sm mt-2">
                                    <div className="flex items-center text-primary font-semibold">
                                    <Star className="w-4 h-4 mr-1 fill-primary" />
                                    {item.rating}
                                    </div>
                                    <span className="text-muted-foreground ml-2">
                                    ({item.reviewCount} reviews)
                                    </span>
                                </div>
                                <p className="text-foreground font-semibold mt-4">
                                    {item.price}
                                </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
