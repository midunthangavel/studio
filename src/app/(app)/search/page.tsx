
import { Suspense } from 'react';
import { SearchPageClient } from './page.client';
import type { Listing } from '@/services/listings';
import { Loader } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

async function performSearch(params: SearchParams): Promise<Listing[]> {
  const { q, location, category, minPrice, maxPrice, guestCapacity, amenities, sortBy } = params;

  const hasSearched = q || location || category || minPrice || maxPrice || guestCapacity || (amenities && amenities.length > 0);
  if (!hasSearched) {
    return [];
  }

  // A more robust implementation would use a dedicated search service like Algolia or MeiliSearch.
  // Firestore is not optimized for complex text search or multi-field filtering with inequalities.
  // This is a simplified search for demonstration purposes.
  let firestoreQuery = query(collection(db, 'listings'));

  if (category && typeof category === 'string') {
    firestoreQuery = query(firestoreQuery, where('category', '==', category));
  }
  if (location && typeof location === 'string') {
    const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);
    firestoreQuery = query(firestoreQuery, where('location', '>=', capitalizedLocation), where('location', '<=', capitalizedLocation + '\uf8ff'));
  }
  if (minPrice && !isNaN(Number(minPrice))) {
    firestoreQuery = query(firestoreQuery, where('priceValue', '>=', Number(minPrice)));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
     firestoreQuery = query(firestoreQuery, where('priceValue', '<=', Number(maxPrice)));
  }
   if (guestCapacity && !isNaN(Number(guestCapacity))) {
    firestoreQuery = query(firestoreQuery, where('guestCapacity', '>=', Number(guestCapacity)));
  }
  
  if (amenities && Array.isArray(amenities) && amenities.length > 0) {
     firestoreQuery = query(firestoreQuery, where('amenities', 'array-contains-any', amenities));
  }
  
  // Sorting must be the last filter applied to the query
  if (sortBy === 'price_asc') {
    firestoreQuery = query(firestoreQuery, orderBy('priceValue', 'asc'));
  } else if (sortBy === 'price_desc') {
    firestoreQuery = query(firestoreQuery, orderBy('priceValue', 'desc'));
  } else if (sortBy === 'rating_desc') {
    firestoreQuery = query(firestoreQuery, orderBy('rating', 'desc'));
  } else {
    // Default sort by rating if no other sorting is specified
    firestoreQuery = query(firestoreQuery, orderBy('rating', 'desc'));
  }

  const querySnapshot = await getDocs(firestoreQuery);
  let results = querySnapshot.docs.map(doc => doc.data() as Listing);

  // Manual filtering for keyword search (q) as Firestore doesn't support it well with other filters
  if (q && typeof q === 'string') {
    const lowerCaseQuery = q.toLowerCase();
    results = results.filter(venue => 
      venue.name.toLowerCase().includes(lowerCaseQuery) ||
      (venue.hint && venue.hint.toLowerCase().includes(lowerCaseQuery)) ||
      venue.description.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return results;
}

// This is a Server Component that fetches data and passes it to a Client Component.
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const searchResults = await performSearch(searchParams);

  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient searchResults={searchResults} />
    </Suspense>
  );
}
