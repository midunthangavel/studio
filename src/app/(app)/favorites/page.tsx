
'use client'

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from "@/components/venue-card";
import { PageWrapper } from "@/components/shared/page-wrapper";
import Link from "next/link";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useFavorites } from "@/context/favorites-context";

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <ProtectedRoute>
    <PageWrapper
        icon={Heart}
        title="My Favorites"
        description="Your saved venues and services all in one place."
    >
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((item) => (
             <VenueCard 
                {...item}
                key={item.slug}
                isCard={false}
                imageClassName="h-64"
                className="border rounded-lg"
                actionButton={
                  <Button 
                    size="icon" 
                    className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full h-9 w-9"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item)
                    }}
                  >
                      <Heart className="w-5 h-5 fill-current" />
                  </Button>
                }
              >
                 <div className="absolute bottom-4 right-4">
                  <Link href={`/venues/${item.slug}`}>
                    <Button>View</Button>
                  </Link>
                 </div>
              </VenueCard>
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
    </ProtectedRoute>
  );
}

export default FavoritesPage;
