
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { VenueCard, VenueCardProps } from "@/components/venue-card";

const popularVenues: VenueCardProps[] = [
  {
    name: "Apartment in Center City",
    location: "New York, NY",
    rating: 4.97,
    price: "$228 for 2 nights",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&h=400&fit=crop",
    hint: "modern apartment",
    guestFavorite: true,
  },
  {
    name: "Place to stay in Strawberry Mansion",
    location: "Chicago, IL",
    rating: 4.8,
    price: "$122 for 2 nights",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&h=400&fit=crop",
    hint: "mansion interior",
    guestFavorite: false,
  },
  {
    name: "The Loft Downtown",
    location: "Los Angeles, CA",
    rating: 4.9,
    price: "$350 for 2 nights",
    image: "https://images.unsplash.com/photo-1493809842344-ab6181ba96a2?q=80&w=600&h=400&fit=crop",
    hint: "modern venue",
    guestFavorite: true,
  },
];

const availableNextMonth: VenueCardProps[] = [
    {
        name: "Apartment in Miami",
        location: "Miami, FL",
        rating: 5.0,
        price: "$381 for 2 nights",
        image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=600&h=400&fit=crop",
        hint: "miami apartment",
        guestFavorite: true,
    },
    {
        name: "Cozy Beach House",
        location: "Malibu, CA",
        rating: 4.99,
        price: "$412 for 2 nights",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&h=400&fit=crop",
        hint: "beach house",
        guestFavorite: true,
    }
]

const VenueSection = ({ title, venues, moreLink }: { title: string, venues: VenueCardProps[], moreLink?: string }) => (
    <section className="py-6">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-headline">
                    {title}
                </h2>
                {moreLink && (
                    <Button variant="link" asChild className="text-primary">
                        <Link href={moreLink}>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue) => (
                     <VenueCard
                        key={venue.name}
                        {...venue}
                        isCard
                        imageClassName="h-64"
                        actionButton={
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full">
                                <Heart className="w-5 h-5" />
                            </Button>
                        }
                     />
                ))}
            </div>
        </div>
    </section>
);


export default function HomePage() {
  return (
    <div className="flex flex-col pb-24">
      <VenueSection title="Popular venues in New York" venues={popularVenues} moreLink="/search" />
      <VenueSection title="Available next month in Miami" venues={availableNextMonth} moreLink="/search?location=Miami" />
    </div>
  );
}
