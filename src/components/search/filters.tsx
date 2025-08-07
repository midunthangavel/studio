
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from "lucide-react";

export const Filters = () => {
    const [priceRange, setPriceRange] = useState([500, 15000]);

    return (
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
}
