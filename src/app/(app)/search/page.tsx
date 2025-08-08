
'use client';
import { allVenues } from '@/lib/venues';
import { SearchPageClient } from './page.client';
import type { VenueCardProps } from '@/components/venue-card';
import { use } from 'react';

// This is a Server Component
export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // The 'use' hook is recommended for accessing searchParams in Server Components.
  const unwrappedSearchParams = use(searchParams);
  const query = unwrappedSearchParams?.q as string | undefined;

  let searchResults: (VenueCardProps & { category: string; })[] = [];
  const hasSearched = !!query;

  if (hasSearched) {
    searchResults = allVenues.filter(venue => 
      venue.name.toLowerCase().includes(query.toLowerCase()) ||
      venue.location.toLowerCase().includes(query.toLowerCase()) ||
      venue.category.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    // When no specific search is made, show some popular items as default
    searchResults = allVenues.slice(0, 6);
  }

  return <SearchPageClient searchResults={searchResults} hasSearched={hasSearched} />;
}
