
import { Suspense } from 'react';
import { allVenues } from '@/lib/venues';
import { SearchPageClient } from './page.client';
import type { VenueCardProps } from '@/components/venue-card';
import { Loader } from 'lucide-react';

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

function SearchFallback() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  )
}

function performSearch(params: SearchParams): (VenueCardProps & { category: string; })[] {
  const { q, location, category, minPrice, maxPrice } = params;
  const hasSearched = q || location || category || minPrice || maxPrice;

  if (!hasSearched) {
    return [];
  }
  
  return allVenues.filter(venue => {
      const queryMatch = !q || (
          venue.name.toLowerCase().includes(String(q).toLowerCase()) ||
          venue.hint.toLowerCase().includes(String(q).toLowerCase())
      );
      const locationMatch = !location || venue.location.toLowerCase().includes(String(location).toLowerCase());
      const categoryMatch = !category || venue.category.toLowerCase() === String(category).toLowerCase();
      const minPriceMatch = !minPrice || venue.priceValue >= Number(minPrice);
      const maxPriceMatch = !maxPrice || venue.priceValue <= Number(maxPrice);

      return queryMatch && locationMatch && categoryMatch && minPriceMatch && maxPriceMatch;
  });
}

// This is a Server Component that fetches data and passes it to a Client Component.
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const searchResults = performSearch(searchParams);

  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient searchResults={searchResults} />
    </Suspense>
  );
}
