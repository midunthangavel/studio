
'use client';

import { VenueCard, VenueCardProps } from "@/components/venue-card";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

interface SearchResultsProps {
    results: (VenueCardProps & { category: string; })[];
    query: string;
    onClose: () => void;
}

export function SearchResults({ results, query, onClose }: SearchResultsProps) {
    const { isFavorited, toggleFavorite } = useFavorites();

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
            <ScrollArea className="max-h-[60vh]">
                <div className="p-4">
                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((item) => {
                                const favorited = isFavorited(item.slug);
                                return (
                                <Link href={`/venues/${item.slug}`} key={item.slug} onClick={onClose}>
                                    <VenueCard
                                        isCard={false}
                                        {...item}
                                        imageClassName="h-32"
                                        className="border-none flex gap-4 items-center hover:bg-muted/50 p-2 rounded-lg"
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
                                            <p className='text-sm text-primary font-semibold my-1'>{item.category}</p>
                                    </VenueCard>
                                </Link>
                            )})}
                        </div>
                    ) : (
                         <div className="text-center py-8">
                            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No Results Found</h3>
                            <p className="text-muted-foreground text-sm">Try adjusting your search for "{query}"</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
