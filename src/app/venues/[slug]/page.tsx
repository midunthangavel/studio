
'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Wifi, ParkingSquare, Utensils, Wind, Calendar as CalendarIcon, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { searchResults } from '@/app/search/page'; // We can reuse the search data for now
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const allVenues = searchResults; // Using the same data source

const amenities = [
    { icon: Wifi, text: 'Free Wi-Fi' },
    { icon: ParkingSquare, text: 'On-site Parking' },
    { icon: Utensils, text: 'In-house Catering' },
    { icon: Wind, text: 'Air Conditioning' },
];

const reviews = [
    {
        author: 'Alice Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        comment: 'Absolutely stunning venue! The staff were incredibly helpful, and everything went perfectly for our wedding. Highly recommended!',
    },
    {
        author: 'Michael Smith',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4,
        comment: 'Great location and beautiful decor. The catering was delicious, although the music system could be a bit better. Overall, a fantastic experience.',
    },
];

export default function VenueDetailPage({ params }: { params: { slug: string } }) {
  const venue = allVenues.find(v => v.slug === params.slug);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  if (!venue) {
    notFound();
  }

  const favorited = isFavorited(venue.slug);

  const handleRequestBooking = () => {
    toast({
        title: "Booking Request Sent!",
        description: `Your request to book ${venue.name} has been sent.`,
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold font-headline">{venue.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">{venue.rating}</span>
                        <span>({venue.reviewCount} reviews)</span>
                    </div>
                    <span className="text-muted-foreground/50">|</span>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{venue.location}</span>
                    </div>
                </div>
            </div>
            <Button 
                variant="outline" 
                size="icon"
                onClick={() => toggleFavorite(venue)}
            >
                <Heart className={cn("w-5 h-5", favorited && "fill-primary text-primary" )} />
                <span className='sr-only'>Favorite</span>
            </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-12">
        <div className="col-span-1">
          <Image src={venue.image} alt={venue.name} width={800} height={600} className="rounded-lg object-cover w-full h-full" data-ai-hint={venue.hint} />
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Image src="https://images.unsplash.com/photo-1519688034509-3f5f3ab4349e?q=80&w=400&h=300&fit=crop" alt="Venue detail 1" width={400} height={300} className="rounded-lg object-cover w-full h-full" data-ai-hint="banquet hall" />
            <Image src="https://images.unsplash.com/photo-1520854221256-17452cc6da82?q=80&w=400&h=300&fit=crop" alt="Venue detail 2" width={400} height={300} className="rounded-lg object-cover w-full h-full" data-ai-hint="wedding table" />
            <Image src="https://images.unsplash.com/photo-1579683348053-14b1c5a942ce?q=80&w=400&h=300&fit=crop" alt="Venue detail 3" width={400} height={300} className="rounded-lg object-cover w-full h-full" data-ai-hint="flower arch" />
            <Image src="https://images.unsplash.com/photo-1512295767273-b684ac69f887?q=80&w=400&h=300&fit=crop" alt="Venue detail 4" width={400} height={300} className="rounded-lg object-cover w-full h-full" data-ai-hint="wedding photography" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About this {venue.category}</h2>
            <p className="text-muted-foreground leading-relaxed">
                {venue.name} is a premier provider of {venue.category.toLowerCase()} services, located in the heart of {venue.location}. With a stellar rating of {venue.rating} from over {venue.reviewCount} clients, we pride ourselves on delivering exceptional experiences. Our space is perfect for weddings, corporate events, and private parties, offering a blend of elegance and modern amenities.
                <br/><br/>
                Our dedicated team works tirelessly to ensure every detail is perfect, from the initial planning stages to the final execution. We offer a range of packages to suit different needs and budgets, all designed to make your special day unforgettable.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-4">
                {amenities.map(amenity => (
                    <div key={amenity.text} className="flex items-center gap-3">
                        <amenity.icon className="w-6 h-6 text-primary" />
                        <span>{amenity.text}</span>
                    </div>
                ))}
            </div>

            <Separator className="my-8" />

            {/* Reviews Section */}
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.author} className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{review.author}</h4>
                                <div className="flex items-center">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                    <CardTitle className='text-xl'>Request to Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-2xl font-bold">{venue.price}</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                className="rounded-md border p-0"
                            />
                        </div>
                         <div>
                            <Label htmlFor="guests">Number of Guests</Label>
                            <Input id="guests" type="number" placeholder="50" />
                        </div>
                    </div>
                    <Button size="lg" className="w-full mt-4" onClick={handleRequestBooking}>Request to Book</Button>
                    <p className="text-center text-sm text-muted-foreground">You won&apos;t be charged yet</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
