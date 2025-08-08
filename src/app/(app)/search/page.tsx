
'use client';
import { allVenues } from '@/lib/venues';
import { SearchPageClient } from './page.client';
import type { VenueCardProps } from '@/components/venue-card';
import { use } from 'react';

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// This is a Server Component
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  // The 'use' hook is recommended for accessing searchParams in Server Components.
  const unwrappedSearchParams = use(searchParams);
  const { q, location, category, minPrice, maxPrice } = unwrappedSearchParams;

  const hasSearched = Object.keys(unwrappedSearchParams).length > 0;

  let searchResults: (VenueCardProps & { category: string; })[] = [];

  if (hasSearched) {
    searchResults = allVenues.filter(venue => {
        const queryMatch = !q || (
            venue.name.toLowerCase().includes((q as string).toLowerCase()) ||
            venue.hint.toLowerCase().includes((q as string).toLowerCase())
        );
        const locationMatch = !location || venue.location.toLowerCase().includes((location as string).toLowerCase());
        const categoryMatch = !category || venue.category.toLowerCase() === (category as string).toLowerCase();
        const minPriceMatch = !minPrice || venue.priceValue >= Number(minPrice);
        const maxPriceMatch = !maxPrice || venue.priceValue <= Number(maxPrice);

        return queryMatch && locationMatch && categoryMatch && minPriceMatch && maxPriceMatch;
    });
  } else {
    // When no specific search is made, show some popular items as default, but we'll show categories instead.
    searchResults = [];
  }

  return <SearchPageClient searchResults={searchResults} searchParams={unwrappedSearchParams} />;
}
