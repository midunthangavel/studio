
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from "lucide-react";
import type { SearchParams } from '@/app/(app)/search/page';

export const Filters = ({ searchParams, id }: { searchParams: SearchParams; id?: string }) => {
    const router = useRouter();

    const [keyword, setKeyword] = useState(searchParams?.q || '');
    const [location, setLocation] = useState(searchParams?.location || '');
    const [category, setCategory] = useState(searchParams?.category || '');
    const [priceRange, setPriceRange] = useState([Number(searchParams?.minPrice) || 0, Number(searchParams?.maxPrice) || 30000]);

    useEffect(() => {
        setKeyword(searchParams?.q || '');
        setLocation(searchParams?.location || '');
        setCategory(searchParams?.category || '');
        setPriceRange([Number(searchParams?.minPrice) || 0, Number(searchParams?.maxPrice) || 30000]);
    }, [searchParams]);

    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('q', String(keyword));
        if (location) params.set('location', String(location));
        if (category) params.set('category', category);
        if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
        if (priceRange[1] < 30000) params.set('maxPrice', String(priceRange[1]));
        
        router.push(`/search?${params.toString()}`);
    }

    return (
        <form id={id} onSubmit={handleFilterSubmit} className="space-y-6">
            <div>
                <Label htmlFor="keyword">Keyword or Name</Label>
                <Input id="keyword" placeholder="e.g., Lakeside, Royal" value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., New York, NY" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="category">Service Type</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Services</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="decorations">Decorations</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="event staff">Event Staff</SelectItem>
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
                    onValueChange={(value) => setPriceRange(value as [number, number])}
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
}
