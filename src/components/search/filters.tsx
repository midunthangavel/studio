
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from "lucide-react";
import { Checkbox } from '../ui/checkbox';
import { categories } from '@/types/listing';

// This could also be fetched from the database in the future
const allAmenities = ['WiFi', 'Parking', 'In-house Catering', 'AV Equipment', 'Outdoor Space', 'Bridal Suite'];

export const Filters = ({ id }: { id?: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 30000
    ]);
    const [guestCapacity, setGuestCapacity] = useState(searchParams.get('guestCapacity') || '');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(searchParams.getAll('amenities'));

    // Effect to update state if URL changes (e.g., browser back/forward)
    useEffect(() => {
        setKeyword(searchParams.get('q') || '');
        setLocation(searchParams.get('location') || '');
        setCategory(searchParams.get('category') || '');
        setPriceRange([
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 30000
        ]);
        setGuestCapacity(searchParams.get('guestCapacity') || '');
        setSelectedAmenities(searchParams.getAll('amenities'));
    }, [searchParams]);

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    }

    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        
        // Update or remove params based on form state
        if (keyword) params.set('q', keyword); else params.delete('q');
        if (location) params.set('location', location); else params.delete('location');
        if (category) params.set('category', category); else params.delete('category');
        if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0])); else params.delete('minPrice');
        if (priceRange[1] < 30000) params.set('maxPrice', String(priceRange[1])); else params.delete('maxPrice');
        if (guestCapacity) params.set('guestCapacity', guestCapacity); else params.delete('guestCapacity');
        
        // Handle array for amenities
        params.delete('amenities');
        selectedAmenities.forEach(a => params.append('amenities', a));
        
        router.push(`/search?${params.toString()}`);
    }

    return (
        <form id={id} onSubmit={handleFilterSubmit} className="space-y-4">
            <div>
                <Label htmlFor="keyword" className='text-xs'>Keyword or Name</Label>
                <Input id="keyword" placeholder="e.g., Lakeside" value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="location" className='text-xs'>Location</Label>
                <Input id="location" placeholder="e.g., New York" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="guestCapacity" className='text-xs'>Guest Capacity</Label>
                <Input id="guestCapacity" type="number" placeholder="e.g., 50" value={guestCapacity} onChange={e => setGuestCapacity(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="category" className='text-xs'>Service Type</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Services</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label className='text-xs mb-2 block'>Amenities</Label>
                <div className='space-y-2'>
                    {allAmenities.map(amenity => (
                         <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`amenity-${amenity}`} 
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={() => handleAmenityChange(amenity)}
                            />
                            <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal">
                                {amenity}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Label className='text-xs'>Price Range</Label>
                <Slider
                    min={0}
                    max={30000}
                    step={100}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className='h-3'
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1] >= 30000 ? '30k+' : `$${priceRange[1]}`}</span>
                </div>
            </div>
            <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
            </Button>
        </form>
    );
}
