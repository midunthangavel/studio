
import { notFound } from 'next/navigation';
import { allVenues } from '@/lib/venues';
import { VenueDetailClient } from '@/components/venue-detail-client';
import type { VenueCardProps } from '@/components/venue-card';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getVenueData(slug: string) {
    const venue = allVenues.find(v => v.slug === slug);
    if (!venue) return null;

    try {
        // In a real app, you would fetch reviews from a 'venues' collection
        // For this demo, we'll just use the mock reviews in allVenues.
        // const venueDoc = await getDoc(doc(db, "venues", slug));
        // if (venueDoc.exists()) {
        //     return { ...venue, ...venueDoc.data() };
        // }
        return venue;

    } catch (error) {
        console.error("Error fetching venue data:", error);
        return venue; // Fallback to mock data
    }
}


// This is a Server Component, it fetches data and passes it to the client component.
export default async function VenueDetailPage({ params }: { params: { slug: string } }) {
  const venue = await getVenueData(params.slug) as VenueCardProps & { category: string; amenities: string[]; reviews: any[] };

  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
