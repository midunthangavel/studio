
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
    image: string;
    hint: string;
    guestFavorite?: boolean;
    isCard?: boolean;
    imageClassName?: string;
    className?: string;
    actionButton?: React.ReactNode;
    children?: React.ReactNode;
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
    <Wrapper className={cn("overflow-hidden group", isCard ? "border-none shadow-none" : "border rounded-lg", className)}>
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className={cn("w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300", isCard ? "rounded-xl" : "rounded-t-lg", imageClassName)}
          data-ai-hint={hint}
        />
        {guestFavorite && (
          <div className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-bold py-1 px-3 rounded-full">
            Guest favorite
          </div>
        )}
        {actionButton}
      </div>
      <CardContent className={cn("p-4", isCard ? "pt-2" : "")}>
        <div className="flex items-center justify-between">
            <h3 className={cn("font-semibold truncate", isCard ? "text-base": "text-lg")}>{name}</h3>
            {isCard && (
                 <div className="flex items-center text-foreground font-medium shrink-0">
                    <Star className="w-4 h-4 mr-1" />
                    {rating}
                </div>
            )}
        </div>

        <div className="flex items-center text-muted-foreground text-sm mt-1">
            <p>{location}</p>
        </div>

         {!isCard && (
            <div className="flex items-center text-sm mt-2">
                <div className="flex items-center text-primary font-semibold">
                <Star className="w-4 h-4 mr-1" />
                {rating}
                </div>
                <span className="text-muted-foreground ml-2">
                ({reviewCount} reviews)
                </span>
            </div>
         )}
        
        {children}

        <p className="text-foreground font-semibold mt-2">
            {price}
        </p>
      </CardContent>
    </Wrapper>
  );
}
