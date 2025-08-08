
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
        // In a real app, you would fetch reviews from a 'venues' collection in Firestore.
        // To keep this demo app simple and performant, we are using the mock reviews 
        // located in the `allVenues` data source.
        return venue;
    } catch (error) {
        console.error("Error fetching venue data:", error);
        return venue; // Fallback to mock data on error
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
