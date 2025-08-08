
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VenueCardProps {
    name: string;
    slug: string;
    location: string;
    rating: number;
    reviewCount?: number;
    price: string;
    priceValue: number;
    image: string;
    hint: string;
    guestFavorite?: boolean;
    isCard?: boolean;
    imageClassName?: string;
    className?: string;
    actionButton?: React.ReactNode;
    children?: React.ReactNode;
    guestCapacity?: number;
    amenities: string[];
    reviews: any[];
}

export function VenueCard({
  name,
  slug,
  location,
  rating,
  reviewCount,
  price,
  image,
  hint,
  guestFavorite,
  isCard = true,
  imageClassName,
  className,
  actionButton,
  children
}: VenueCardProps) {
  const Wrapper = isCard ? Card : 'div';
  return (
    <Wrapper className={cn("overflow-hidden group", className)}>
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className={cn("w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg", imageClassName)}
          data-ai-hint={hint}
        />
        {guestFavorite && (
          <div className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-bold py-1 px-2 rounded-full">
            Guest favorite
          </div>
        )}
        {actionButton}
      </div>
      <CardContent className={cn(isCard ? "pt-2 px-1" : "p-3")}>
        <div className="flex items-center justify-between">
            <h3 className={cn("font-semibold truncate", isCard ? "text-sm": "text-base")}>{name}</h3>
            {rating > 0 && (
                 <div className="flex items-center text-foreground font-medium text-sm shrink-0">
                    <Star className="w-3.5 h-3.5 mr-1 text-primary fill-current" />
                    {rating}
                </div>
            )}
        </div>

        <div className="flex items-center text-muted-foreground text-xs mt-1">
            <p>{location}</p>
        </div>

         {!isCard && reviewCount && (
            <div className="flex items-center text-xs mt-1">
                <span className="text-muted-foreground">
                    ({reviewCount} reviews)
                </span>
            </div>
         )}
        
        {children}

        <p className="text-foreground font-semibold mt-1.5 text-sm">
            {price}
        </p>
      </CardContent>
    </Wrapper>
  );
}
