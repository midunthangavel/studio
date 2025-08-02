
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from "@/components/venue-card";

const favoriteItems: Omit<VenueCardProps, 'guestFavorite' | 'isCard' | 'imageClassName' | 'className' | 'actionButton' | 'children' >[] = [
  {
    name: "The Grand Palace",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 120,
    price: "Starts from $5,000",
    image: "https://placehold.co/600x400.png",
    hint: "wedding reception"
  },
  {
    name: "Timeless Moments Photography",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviewCount: 300,
    price: "$2,500",
    image: "https://placehold.co/600x400.png",
    hint: "wedding photography"
  },
  {
    name: "Greenwood Gardens",
    location: "Miami, FL",
    rating: 4.7,
    reviewCount: 95,
    price: "Starts from $4,200",
    image: "https://placehold.co/600x400.png",
    hint: "garden party"
  },
];

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          My Favorites
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your saved venues and services all in one place.
        </p>
      </div>

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteItems.map((item) => (
            <VenueCard 
              key={item.name}
              {...item}
              isCard={false}
              className="border rounded-lg"
              actionButton={
                <Button size="icon" className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full h-9 w-9">
                    <Heart className="w-5 h-5 fill-current" />
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <div className="border-dashed border rounded-lg">
            <div className="p-10 text-center">
                <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground">
                Click the heart icon on any venue or service to save them here.
                </p>
            </div>
        </div>
      )}
    </div>
  );
}
