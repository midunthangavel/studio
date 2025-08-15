
import { db } from '@/lib/firebase';
import type { VenueCardProps } from '@/components/venue-card';
import { collection, doc, getDoc, getDocs, query, where, limit, orderBy } from 'firebase/firestore';

export type Listing = VenueCardProps & { category: string; priceValue: number; guestCapacity: number, amenities: string[], reviews: any[] };

/**
 * Fetches all listings from Firestore.
 */
export async function getAllListings(): Promise<Listing[]> {
  try {
    const listingsCol = collection(db, 'listings');
    const snapshot = await getDocs(listingsCol);
    if (snapshot.empty) {
      console.log('No listings found.');
      return [];
    }
    return snapshot.docs.map(doc => doc.data() as Listing);
  } catch (error) {
    console.error("Error fetching all listings: ", error);
    // In case of error, return an empty array to prevent app crash
    return [];
  }
}

/**
 * Fetches a single listing by its slug (document ID).
 */
export async function getListingBySlug(slug: string): Promise<Listing | null> {
    try {
        const listingRef = doc(db, 'listings', slug);
        const docSnap = await getDoc(listingRef);

        if (docSnap.exists()) {
            return docSnap.data() as Listing;
        } else {
            console.log(`No listing found with slug: ${slug}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching listing with slug ${slug}:`, error);
        return null;
    }
}

/**
 * Fetches a limited number of listings, optionally filtered by category.
 */
export async function getLimitedListings({
  count,
  category,
}: {
  count: number;
  category?: string;
}): Promise<Listing[]> {
  try {
    let q = query(collection(db, 'listings'), orderBy('rating', 'desc'), limit(count));

    if (category) {
      q = query(
        collection(db, 'listings'),
        where('category', '==', category),
        orderBy('rating', 'desc'),
        limit(count)
      );
    }
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => doc.data() as Listing);

  } catch (error) {
    console.error(`Error fetching limited listings (category: ${category}): `, error);
    return [];
  }
}
