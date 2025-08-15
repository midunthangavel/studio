
import { VenueSection } from "@/components/home/venue-section";
import { getLimitedListings } from "@/services/listings";

export default async function HomePage() {
  // Fetch data dynamically from Firestore
  const popularVenues = await getLimitedListings({ count: 4 });
  const topPhotographers = await getLimitedListings({ count: 4, category: 'Photography' });
  const invitationDesigners = await getLimitedListings({ count: 4, category: 'Invitations' });
  const availableNextMonth = await getLimitedListings({ count: 4 }); // Placeholder logic for now

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
        <VenueSection title="Top Photographers" venues={topPhotographers} moreLink="/search?category=photography" />
        <VenueSection title="Invitation Designers" venues={invitationDesigners} moreLink="/search?category=invitations" />
        <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search" />
      </div>
    </div>
  );
}
