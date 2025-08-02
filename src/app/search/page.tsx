
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ListFilter, Search, Star } from "lucide-react";
import { VenueCard, VenueCardProps } from '@/components/venue-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const searchResults: (VenueCardProps & { category: string })[] = [
    // Catering Services
    {
        name: "Gourmet Delights Catering",
        slug: "gourmet-delights-catering",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 150,
        price: "$120/person",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "catering food"
    },
    {
        name: "Exquisite Eats",
        slug: "exquisite-eats",
        location: "Los Angeles, CA",
        rating: 4.8,
        reviewCount: 110,
        price: "$150/person",
        image: "https://images.unsplash.com/photo-1621996346565-e326e22e3920?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "fine dining"
    },
    {
        name: "The Wedding Feast",
        slug: "the-wedding-feast",
        location: "Chicago, IL",
        rating: 5.0,
        reviewCount: 200,
        price: "$135/person",
        image: "https://images.unsplash.com/photo-1565299543923-37dd37887f2b?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "wedding buffet"
    },
    {
        name: "Saffron & Spice",
        slug: "saffron-spice",
        location: "Houston, TX",
        rating: 4.7,
        reviewCount: 95,
        price: "$110/person",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "gourmet salad"
    },
    {
        name: "Farm to Table Creations",
        slug: "farm-to-table-creations",
        location: "San Francisco, CA",
        rating: 4.9,
        reviewCount: 130,
        price: "$180/person",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "restaurant table"
    },
    {
        name: "Coastal Cuisine",
        slug: "coastal-cuisine",
        location: "Miami, FL",
        rating: 4.8,
        reviewCount: 125,
        price: "$160/person",
        image: "https://images.unsplash.com/photo-1517042078839-86a640141639?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "seafood platter"
    },
    {
        name: "The Rustic Platter",
        slug: "the-rustic-platter",
        location: "Austin, TX",
        rating: 4.6,
        reviewCount: 80,
        price: "$100/person",
        image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "pizza sharing"
    },
    {
        name: "Vegan Vogue Events",
        slug: "vegan-vogue-events",
        location: "Portland, OR",
        rating: 5.0,
        reviewCount: 180,
        price: "$140/person",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "vegan salad"
    },
    {
        name: "Decadent Desserts Bar",
        slug: "decadent-desserts-bar",
        location: "Las Vegas, NV",
        rating: 4.9,
        reviewCount: 220,
        price: "$50/person",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "dessert table"
    },
    {
        name: "International Flavors Co.",
        slug: "international-flavors-co",
        location: "Washington, D.C.",
        rating: 4.7,
        reviewCount: 140,
        price: "$130/person",
        image: "https://images.unsplash.com/photo-1559847844-5315695d0464?q=80&w=600&h=400&fit=crop",
        category: "Catering",
        hint: "sushi platter"
    },

    // Transport Services
    {
        name: "Prestige Bridal Cars",
        slug: "prestige-bridal-cars",
        location: "New York, NY",
        rating: 5.0,
        reviewCount: 180,
        price: "Starts from $500",
        image: "https://images.unsplash.com/photo-1618951012351-38a6a79b21e8?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "luxury car"
    },
    {
        name: "Royal Rolls Royce",
        slug: "royal-rolls-royce",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 210,
        price: "Starts from $800",
        image: "https://images.unsplash.com/photo-1553552575-b4b73b6441d6?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "vintage car"
    },
    {
        name: "Classic Limo Service",
        slug: "classic-limo-service",
        location: "Chicago, IL",
        rating: 4.8,
        reviewCount: 150,
        price: "Starts from $350",
        image: "https://images.unsplash.com/photo-1527018601622-c43a0a1d4012?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "limousine"
    },
    {
        name: "Wedding Wheels Vintage",
        slug: "wedding-wheels-vintage",
        location: "San Francisco, CA",
        rating: 4.9,
        reviewCount: 130,
        price: "Starts from $600",
        image: "https://images.unsplash.com/photo-1541443131-27635c6fb584?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "classic car"
    },
    {
        name: "Citywide Party Bus",
        slug: "citywide-party-bus",
        location: "Las Vegas, NV",
        rating: 4.7,
        reviewCount: 90,
        price: "Starts from $450",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "party bus"
    },
     {
        name: "Elegant Excursions",
        slug: "elegant-excursions",
        location: "Miami, FL",
        rating: 4.8,
        reviewCount: 115,
        price: "Starts from $550",
        image: "https://images.unsplash.com/photo-1599198664923-8636186a8779?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "white car"
    },
    {
        name: "Getaway Car Rentals",
        slug: "getaway-car-rentals",
        location: "Austin, TX",
        rating: 4.6,
        reviewCount: 75,
        price: "Starts from $400",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "sports car"
    },
    {
        name: "Enchanted Carriages",
        slug: "enchanted-carriages",
        location: "Orlando, FL",
        rating: 5.0,
        reviewCount: 190,
        price: "Starts from $700",
        image: "https://images.unsplash.com/photo-1532517834468-523e3a478363?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "horse carriage"
    },
    {
        name: "Metro Lux Shuttles",
        slug: "metro-lux-shuttles",
        location: "Washington, D.C.",
        rating: 4.7,
        reviewCount: 100,
        price: "Starts from $300",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c186923?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "shuttle bus"
    },
    {
        name: "Regal Auto Group",
        slug: "regal-auto-group",
        location: "Houston, TX",
        rating: 4.8,
        reviewCount: 140,
        price: "Starts from $650",
        image: "https://images.unsplash.com/photo-1629822434086-291705b79373?q=80&w=600&h=400&fit=crop",
        category: "Transport",
        hint: "black car"
    },

    // Decoration Vendors
    {
        name: "Bloom & Blossom Florals",
        slug: "bloom-blossom-florals",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 220,
        price: "Packages from $2,000",
        image: "https://images.unsplash.com/photo-1579683348053-14b1c5a942ce?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "flower arch"
    },
    {
        name: "Enchanted Events Decor",
        slug: "enchanted-events-decor",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 250,
        price: "Packages from $3,500",
        image: "https://images.unsplash.com/photo-1520854221256-17452cc6da82?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "wedding table"
    },
    {
        name: "Luxe Lighting & Draping",
        slug: "luxe-lighting-draping",
        location: "Miami, FL",
        rating: 4.8,
        reviewCount: 180,
        price: "Packages from $1,800",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "event lighting"
    },
    {
        name: "The Perfect Arrangement",
        slug: "the-perfect-arrangement",
        location: "Chicago, IL",
        rating: 4.9,
        reviewCount: 190,
        price: "Packages from $2,200",
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "table setting"
    },
    {
        name: "Rustic Charm Rentals",
        slug: "rustic-charm-rentals",
        location: "Austin, TX",
        rating: 4.7,
        reviewCount: 140,
        price: "Packages from $1,500",
        image: "https://images.unsplash.com/photo-1550081693-490354b6f585?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "rustic decor"
    },
    {
        name: "Elegant Petals",
        slug: "elegant-petals",
        location: "San Francisco, CA",
        rating: 5.0,
        reviewCount: 280,
        price: "Packages from $3,000",
        image: "https://images.unsplash.com/photo-1554224324-4b51a7e4d583?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "flower arrangement"
    },
    {
        name: "Dreamy Designs Co.",
        slug: "dreamy-designs-co",
        location: "Houston, TX",
        rating: 4.8,
        reviewCount: 160,
        price: "Packages from $2,800",
        image: "https://images.unsplash.com/photo-1523438885278-83b9e5f935b7?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "wedding decorations"
    },
    {
        name: "Fantasy Floral Creations",
        slug: "fantasy-floral-creations",
        location: "Las Vegas, NV",
        rating: 4.9,
        reviewCount: 210,
        price: "Packages from $4,000",
        image: "https://images.unsplash.com/photo-1567475854498-7a58f4a15a8e?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "wedding centerpiece"
    },
    {
        name: "Modern Mandaps",
        slug: "modern-mandaps",
        location: "Washington, D.C.",
        rating: 5.0,
        reviewCount: 170,
        price: "Packages from $3,200",
        image: "https://images.unsplash.com/photo-1628198942363-a20a4b4a1f5d?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "wedding mandap"
    },
    {
        name: "Ivy & Gold Events",
        slug: "ivy-gold-events",
        location: "Atlanta, GA",
        rating: 4.9,
        reviewCount: 195,
        price: "Packages from $2,500",
        image: "https://images.unsplash.com/photo-1519688034509-3f5f3ab4349e?q=80&w=600&h=400&fit=crop",
        category: "Decorations",
        hint: "banquet hall"
    },

    // Photography Agencies
    {
        name: "Timeless Moments Photo",
        slug: "timeless-moments-photo",
        location: "New York, NY",
        rating: 5.0,
        reviewCount: 350,
        price: "$4,500",
        image: "https://images.unsplash.com/photo-1512295767273-b684ac69f887?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "wedding photography"
    },
    {
        name: "Captured by Light",
        slug: "captured-by-light",
        location: "Los Angeles, CA",
        rating: 4.9,
        reviewCount: 280,
        price: "$5,000",
        image: "https://images.unsplash.com/photo-1519415943484-2fa1873496d7?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "couple portrait"
    },
    {
        name: "Golden Hour Films",
        slug: "golden-hour-films",
        location: "San Francisco, CA",
        rating: 5.0,
        reviewCount: 310,
        price: "$6,000",
        image: "https://images.unsplash.com/photo-1515942352-7164a2c35583?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "beach wedding"
    },
    {
        name: "Windy City Weddings",
        slug: "windy-city-weddings",
        location: "Chicago, IL",
        rating: 4.8,
        reviewCount: 240,
        price: "$4,200",
        image: "https://images.unsplash.com/photo-1545939227-6df15743c498?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "city couple"
    },
    {
        name: "Love Story Studios",
        slug: "love-story-studios",
        location: "Miami, FL",
        rating: 4.9,
        reviewCount: 290,
        price: "$4,800",
        image: "https://images.unsplash.com/photo-1523438885278-83b9e5f935b7?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "wedding couple"
    },
    {
        name: "Candid Captures",
        slug: "candid-captures",
        location: "Austin, TX",
        rating: 4.7,
        reviewCount: 200,
        price: "$3,800",
        image: "https://images.unsplash.com/photo-1455853659723-3b0d5ee08c16?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "wedding kiss"
    },
    {
        name: "Forever & Always Photo",
        slug: "forever-always-photo",
        location: "Houston, TX",
        rating: 4.9,
        reviewCount: 260,
        price: "$4,400",
        image: "https://images.unsplash.com/photo-1510629763133-13431b5c9247?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "wedding rings"
    },
    {
        name: "Mountainscape Media",
        slug: "mountainscape-media",
        location: "Denver, CO",
        rating: 5.0,
        reviewCount: 220,
        price: "$5,500",
        image: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "mountain wedding"
    },
    {
        name: "Coastal Clicks",
        slug: "coastal-clicks",
        location: "San Diego, CA",
        rating: 4.8,
        reviewCount: 230,
        price: "$4,600",
        image: "https://images.unsplash.com/photo-1541258692634-f655e0324823?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "beach couple"
    },
    {
        name: "Artistic Angles",
        slug: "artistic-angles",
        location: "Washington, D.C.",
        rating: 4.9,
        reviewCount: 270,
        price: "$5,200",
        image: "https://images.unsplash.com/photo-1511285560921-5ae97c6abc59?q=80&w=600&h=400&fit=crop",
        category: "Photography",
        hint: "wedding details"
    },
    // Event Staff
    {
        name: "Top-Tier Event Staffing",
        slug: "top-tier-event-staffing",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 180,
        price: "$35/hour per staff",
        image: "https://images.unsplash.com/photo-1579782194332-f3a2d83a1f94?q=80&w=600&h=400&fit=crop",
        category: "Event Staff",
        hint: "event staff"
    },
    {
        name: "LA Elite Bartenders",
        slug: "la-elite-bartenders",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 250,
        price: "$50/hour per bartender",
        image: "https://images.unsplash.com/photo-1588899756938-a2ea46633ea8?q=80&w=600&h=400&fit=crop",
        category: "Event Staff",
        hint: "bartender"
    }
];

export default function SearchPage() {
    const [priceRange, setPriceRange] = useState([500, 15000]);

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
             <div className="flex flex-col">
                {/* Search Results */}
                <main>
                    <div className='flex justify-between items-center mb-6'>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">Search Results</h1>
                            <p className="text-muted-foreground">Showing {searchResults.length} results for your special day.</p>
                        </div>
                        <div className="hidden md:block">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <ListFilter className="mr-2 h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-4">
                                        <Filters />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((item) => (
                             <Link href={`/venues/${item.slug}`} key={item.name}>
                                <VenueCard 
                                    isCard
                                    {...item}
                                    imageClassName="h-64"
                                    actionButton={
                                        <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-full">
                                            <Star className="w-5 h-5 text-accent" />
                                        </div>
                                    }
                                    >
                                        <p className='text-sm text-primary font-semibold my-1'>{item.category}</p>
                                </VenueCard>
                            </Link>
                        ))}
                    </div>
                </main>
                 {/* Mobile Filters */}
                <div className="md:hidden fixed bottom-20 right-4 z-50">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" className="rounded-full shadow-lg h-14 w-14">
                                <ListFilter className="h-6 w-6" />
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
        </div>
    );
}
