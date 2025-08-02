
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VenueCardProps {
    name: string;
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
    <Wrapper className={cn("overflow-hidden group", isCard ? "border-none shadow-none" : "", className)}>
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className={cn("w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300", isCard ? "rounded-xl" : "", imageClassName)}
          data-ai-hint={hint}
        />
        {guestFavorite && (
          <div className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-bold py-1 px-3 rounded-full">
            Guest favorite
          </div>
        )}
        {actionButton}
      </div>
      <CardContent className="p-2">
        <h3 className={cn("font-semibold mt-1", isCard ? "text-base": "text-lg")}>{name}</h3>
        {children}
        <div className="flex items-center text-muted-foreground text-sm mt-1">
            {isCard ? (
                <>
                    <p className="text-muted-foreground">{price}</p>
                    <div className="flex items-center text-foreground font-medium ml-auto">
                        <Star className="w-4 h-4 mr-1 fill-primary text-primary" />
                        {rating}
                    </div>
                </>
            ): (
                <>
                    <MapPin className="w-4 h-4 mr-1" />
                    {location}
                </>
            )}
        </div>
         {!isCard && (
            <>
                <div className="flex items-center text-sm mt-2">
                    <div className="flex items-center text-primary font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-primary" />
                    {rating}
                    </div>
                    <span className="text-muted-foreground ml-2">
                    ({reviewCount} reviews)
                    </span>
                </div>
                <p className="text-foreground font-semibold mt-4">
                    {price}
                </p>
            </>
         )}
      </CardContent>
    </Wrapper>
  );
}
