
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { VenueCard, VenueCardProps } from "@/components/venue-card";

const popularVenues: VenueCardProps[] = [
  {
    name: "The Grand Ballroom",
    location: "New York, NY",
    rating: 4.97,
    price: "$12,000 per event",
    image: "https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=600&h=400&fit=crop",
    hint: "luxury ballroom",
    guestFavorite: true,
  },
  {
    name: "Lakeside Manor",
    location: "Chicago, IL",
    rating: 4.8,
    price: "$8,000 per event",
    image: "https://images.unsplash.com/photo-1519225421980-715cb02cf58c?q=80&w=600&h=400&fit=crop",
    hint: "outdoor wedding",
    guestFavorite: false,
  },
  {
    name: "The Loft Downtown",
    location: "Los Angeles, CA",
    rating: 4.9,
    price: "$9,500 per event",
    image: "https://images.unsplash.com/photo-1542882583-4c4f494429f2?q=80&w=600&h=400&fit=crop",
    hint: "urban loft",
    guestFavorite: true,
  },
  {
    name: "The Garden Pavilion",
    location: "San Francisco, CA",
    rating: 4.85,
    price: "$7,500 per event",
    image: "https://images.unsplash.com/photo-1518987048-93e29699e798?q=80&w=600&h=400&fit=crop",
    hint: "garden party",
    guestFavorite: false,
  },
];

const availableNextMonth: VenueCardProps[] = [
    {
        name: "Sunset Beach Resort",
        location: "Miami, FL",
        rating: 5.0,
        price: "$15,000 per event",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&h=400&fit=crop",
        hint: "beach resort",
        guestFavorite: true,
    },
    {
        name: "Enchanted Forest Hall",
        location: "Asheville, NC",
        rating: 4.99,
        price: "$11,200 per event",
        image: "https://images.unsplash.com/photo-1531053326103-f04c63d014ac?q=80&w=600&h=400&fit=crop",
        hint: "forest wedding",
        guestFavorite: true,
    },
    {
        name: "The Mountain Chalet",
        location: "Denver, CO",
        rating: 4.95,
        price: "$10,500 per event",
        image: "https://images.unsplash.com/photo-1566438480900-0e09ef7e1a06?q=80&w=600&h=400&fit=crop",
        hint: "mountain view",
        guestFavorite: false,
    }
]

const VenueSection = ({ title, venues, moreLink }: { title: string, venues: VenueCardProps[], moreLink?: string }) => (
    <section className="py-6">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold font-headline">
                    {title}
                </h2>
                {moreLink && (
                    <Button variant="link" asChild className="text-primary">
                        <Link href={moreLink}>
                            See all <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div className="flex flex-col py-6">
      <VenueSection title="Popular venues" venues={popularVenues} moreLink="/search" />
      <VenueSection title="Available next month" venues={availableNextMonth} moreLink="/search?location=Miami" />
    </div>
  );
}
