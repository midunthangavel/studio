
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";

const favoriteItems = [
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
            <Card key={item.name} className="overflow-hidden group">
              <div className="relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={item.hint}
                />
                <Button size="icon" className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full h-9 w-9">
                  <Heart className="w-5 h-5 fill-current" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
                <div className="flex items-center text-sm mt-2">
                  <div className="flex items-center text-primary font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-primary" />
                    {item.rating}
                  </div>
                  <span className="text-muted-foreground ml-2">
                    ({item.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-foreground font-semibold mt-4">
                  {item.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
            <CardContent className="p-10 text-center">
                <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground">
                Click the heart icon on any venue or service to save them here.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
