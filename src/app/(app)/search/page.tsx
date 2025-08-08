
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
  const { q, location, category, minPrice, maxPrice, guestCapacity, amenities, sortBy } = params;
  
  const hasSearched = q || location || category || minPrice || maxPrice || guestCapacity || amenities;
  if (!hasSearched) {
    return [];
  }
  
  let results = allVenues.filter(venue => {
      const queryMatch = !q || (
          venue.name.toLowerCase().includes(String(q).toLowerCase()) ||
          venue.hint.toLowerCase().includes(String(q).toLowerCase())
      );
      const locationMatch = !location || venue.location.toLowerCase().includes(String(location).toLowerCase());
      const categoryMatch = !category || venue.category.toLowerCase() === String(category).toLowerCase();
      const minPriceMatch = !minPrice || venue.priceValue >= Number(minPrice);
      const maxPriceMatch = !maxPrice || venue.priceValue <= Number(maxPrice);
      const guestCapacityMatch = !guestCapacity || venue.guestCapacity >= Number(guestCapacity);
      const amenitiesMatch = !amenities || (Array.isArray(amenities) ? amenities : [amenities]).every(a => venue.amenities.includes(a));


      return queryMatch && locationMatch && categoryMatch && minPriceMatch && maxPriceMatch && guestCapacityMatch && amenitiesMatch;
  });

  switch (sortBy) {
    case 'price_asc':
        results.sort((a, b) => a.priceValue - b.priceValue);
        break;
    case 'price_desc':
        results.sort((a, b) => b.priceValue - a.priceValue);
        break;
    case 'rating_desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
    default:
        // default sort or no sort
        break;
  }
  
  return results;
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
