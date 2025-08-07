
import { notFound } from 'next/navigation';
import { allVenues } from '@/lib/venues';
import { VenueDetailClient } from '@/components/venue-detail-client';

export default function VenueDetailPage({ params }: { params: { slug: string } }) {
  const venue = allVenues.find(v => v.slug === params.slug);

  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
