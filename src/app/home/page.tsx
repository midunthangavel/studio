
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const popularVenues = [
  {
    name: "Apartment in Center City",
    location: "New York, NY",
    rating: 4.97,
    price: "$228 for 2 nights",
    image: "https://placehold.co/600x400.png",
    hint: "modern apartment",
    guestFavorite: true,
  },
  {
    name: "Place to stay in Strawberry Mansion",
    location: "Chicago, IL",
    rating: 4.8,
    price: "$122 for 2 nights",
    image: "https://placehold.co/600x400.png",
    hint: "mansion interior",
    guestFavorite: false,
  },
  {
    name: "The Loft Downtown",
    location: "Los Angeles, CA",
    rating: 4.9,
    price: "$350 for 2 nights",
    image: "https://placehold.co/600x400.png",
    hint: "modern venue",
    guestFavorite: true,
  },
];

const availableNextMonth = [
    {
        name: "Apartment in Miami",
        location: "Miami, FL",
        rating: 5.0,
        price: "$381 for 2 nights",
        image: "https://placehold.co/600x400.png",
        hint: "miami apartment",
        guestFavorite: true,
    },
    {
        name: "Cozy Beach House",
        location: "Malibu, CA",
        rating: 4.99,
        price: "$412 for 2 nights",
        image: "https://placehold.co/600x400.png",
        hint: "beach house",
        guestFavorite: true,
    }
]

export default function HomePage() {
  return (
    <div className="flex flex-col pb-24">
      {/* Popular Venues Section */}
      <section id="popular" className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-headline">
              Popular venues in New York
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/search">
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVenues.map((venue) => (
              <Card key={venue.name} className="overflow-hidden group border-none shadow-none">
                <div className="relative">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={venue.hint}
                  />
                  {venue.guestFavorite && (
                    <div className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-bold py-1 px-3 rounded-full">
                      Guest favorite
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full">
                     <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-2">
                  <h3 className="font-semibold text-base mt-1">{venue.name}</h3>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <p className="text-muted-foreground">{venue.price}</p>
                    <div className="flex items-center text-foreground font-medium">
                      <Star className="w-4 h-4 mr-1 fill-primary text-primary" />
                      {venue.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* Available Next Month Section */}
      <section id="available" className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-headline">
              Available next month in Miami
            </h2>
            <Button variant="link" asChild className="text-primary">
              <Link href="/search?location=Miami">
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableNextMonth.map((venue) => (
              <Card key={venue.name} className="overflow-hidden group border-none shadow-none">
                <div className="relative">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={venue.hint}
                  />
                   {venue.guestFavorite && (
                    <div className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-bold py-1 px-3 rounded-full">
                      Guest favorite
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full">
                     <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-2">
                  <h3 className="font-semibold text-base mt-1">{venue.name}</h3>
                   <div className="flex items-center justify-between text-sm mt-1">
                    <p className="text-muted-foreground">{venue.price}</p>
                    <div className="flex items-center text-foreground font-medium">
                      <Star className="w-4 h-4 mr-1 fill-primary text-primary" />
                      {venue.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
