
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from "@/components/venue-card";
import { PageWrapper } from "@/components/page-wrapper";

const favoriteItems: Omit<VenueCardProps, 'guestFavorite' | 'isCard' | 'imageClassName' | 'className' | 'actionButton' | 'children' >[] = [
  {
    name: "The Grand Palace",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 120,
    price: "Starts from $5,000",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&h=400&fit=crop",
    hint: "wedding reception"
  },
  {
    name: "Timeless Moments Photography",
    location: "Los Angeles, CA",
    rating: 5.0,
    reviewCount: 300,
    price: "$2,500",
    image: "https://images.unsplash.com/photo-1512295767273-b684ac69f887?q=80&w=600&h=400&fit=crop",
    hint: "wedding photography"
  },
  {
    name: "Greenwood Gardens",
    location: "Miami, FL",
    rating: 4.7,
    reviewCount: 95,
    price: "Starts from $4,200",
    image: "https://images.unsplash.com/photo-1518987048-93e29699e798?q=80&w=600&h=400&fit=crop",
    hint: "garden party"
  },
];

export default function FavoritesPage() {
  return (
    <PageWrapper
        icon={Heart}
        title="My Favorites"
        description="Your saved venues and services all in one place."
    >
      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteItems.map((item) => (
            <VenueCard 
              key={item.name}
              {...item}
              isCard={false}
              imageClassName="h-64"
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
    </PageWrapper>
  );
}
