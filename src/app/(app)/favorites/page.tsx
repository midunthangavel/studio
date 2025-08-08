
'use client'

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { VenueCard, VenueCardProps } from "@/components/venue-card";
import { PageWrapper } from "@/components/shared/page-wrapper";
import Link from "next/link";
import { useFavorites } from "@/context/favorites-context";

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <PageWrapper
        icon={Heart}
        title="My Favorites"
        description="Your saved venues and services all in one place."
    >
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
             <VenueCard 
                {...item}
                key={item.slug}
                isCard={false}
                imageClassName="h-56"
                className="border rounded-lg"
                actionButton={
                  <Button 
                    size="icon" 
                    className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item)
                    }}
                  >
                      <Heart className="w-4 h-4 fill-current" />
                  </Button>
                }
              >
                 <div className="absolute bottom-3 right-3">
                  <Link href={`/venues/${item.slug}`}>
                    <Button size="sm">View</Button>
                  </Link>
                 </div>
              </VenueCard>
          ))}
        </div>
      ) : (
        <div className="border-dashed border rounded-lg">
            <div className="p-8 text-center">
                <div className="mx-auto w-fit bg-secondary p-3 rounded-full mb-3">
                <Heart className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No Favorites Yet</h3>
                <p className="text-muted-foreground text-sm">
                Click the heart icon on any venue or service to save them here.
                </p>
            </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default FavoritesPage;
