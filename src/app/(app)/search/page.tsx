
import { allVenues } from '@/lib/venues';
import { SearchPageClient } from './page.client';
import type { VenueCardProps } from '@/components/venue-card';

// This is a Server Component
export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  // In a real app, you'd filter `allVenues` based on `searchParams`
  // For now, we'll just pass all of them down.
  const searchResults: (VenueCardProps & { category: string; })[] = allVenues;

  return <SearchPageClient searchResults={searchResults} />;
}
