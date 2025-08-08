
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from "lucide-react";

export const Filters = ({ id }: { id?: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 30000]);

    useEffect(() => {
        setKeyword(searchParams.get('q') || '');
        setLocation(searchParams.get('location') || '');
        setCategory(searchParams.get('category') || '');
        setPriceRange([
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 30000
        ]);
    }, [searchParams]);

    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (keyword) params.set('q', keyword); else params.delete('q');
        if (location) params.set('location', location); else params.delete('location');
        if (category) params.set('category', category); else params.delete('category');
        if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0])); else params.delete('minPrice');
        if (priceRange[1] < 30000) params.set('maxPrice', String(priceRange[1])); else params.delete('maxPrice');
        
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
