
import { notFound } from 'next/navigation';
import { allVenues } from '@/lib/venues';
import { VenueDetailClient } from '@/components/venue-detail-client';
import type { VenueCardProps } from '@/components/venue-card';

// This is a Server Component, it fetches data and passes it to the client component.
export default function VenueDetailPage({ params }: { params: { slug: string } }) {
  const venue = allVenues.find(v => v.slug === params.slug);

  if (!venue) {
    notFound();
  }

  const venueWithCategory: VenueCardProps & { category: string } = venue;

  return <VenueDetailClient venue={venueWithCategory} />;
}
