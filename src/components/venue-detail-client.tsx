
'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Wifi, ParkingSquare, Utensils, Wind, Calendar as CalendarIcon, Heart, Loader, MessageSquare } from 'lucide-react';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { addDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { VenueCardProps } from './venue-card';

const galleryImages = [
    "https://placehold.co/400x300.png",
    "https://placehold.co/400x300.png",
    "https://placehold.co/400x300.png",
    "https://placehold.co/400x300.png",
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400.png"
];

// Mock booked dates
const bookedDates = [addDays(new Date(), 5), addDays(new Date(), 6), addDays(new Date(), 15), addDays(new Date(), 16)];
const pendingDates = [addDays(new Date(), 10), addDays(new Date(), 11)];


export function VenueDetailClient({ venue }: { venue: VenueCardProps & { category: string, amenities: string[], reviews: any[] } }) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(50);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(venue.reviews || []);

  useEffect(() => {
    setCurrentReviews(venue.reviews || [])
  }, [venue.reviews])


  const favorited = isFavorited(venue.slug);

  const handleRequestBooking = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to book a venue.",
        });
        router.push('/login');
        return;
    }
    setLoading(true);
    try {
        await addDoc(collection(db, "bookings"), {
            userId: user.uid,
            venueId: venue.slug,
            venueName: venue.name,
            venueImage: venue.image,
            venueLocation: venue.location,
            venueHint: venue.hint,
            bookingDate: date,
            guestCount: guests,
            status: 'Confirmed', // Defaulting to confirmed for demo
            createdAt: serverTimestamp(),
            review: null,
        });
        toast({
            title: "Booking Request Sent!",
            description: `Your request to book ${venue.name} has been sent.`,
        });
        router.push('/bookings');
    } catch (error) {
        console.error("Error creating booking: ", error);
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "There was an error sending your booking request. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  }

  const handleContactProvider = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to contact a provider.",
        });
        router.push('/login');
        return;
    }
    setContactLoading(true);
    try {
        const providerId = `provider_${venue.slug}`; 
        
        const conversationId = [user.uid, providerId].sort().join('_');
        const conversationRef = doc(db, 'conversations', conversationId);
        
        const conversationSnap = await getDoc(conversationRef);

        if (!conversationSnap.exists()) {
             await setDoc(conversationRef, {
                participants: {
                    [user.uid]: {
                        name: user.displayName || user.email,
                        avatar: user.photoURL || `https://avatar.vercel.sh/${user.uid}.png`,
                    },
                    [providerId]: {
                        name: venue.name,
                        avatar: venue.image,
                    }
                },
                messages: [],
                createdAt: serverTimestamp(),
            });
        }
        
        router.push('/chat');

    } catch (error) {
         console.error("Error starting conversation: ", error);
        toast({
            variant: "destructive",
            title: "Failed to Start Chat",
            description: "There was an error initiating the conversation. Please try again.",
        });
    } finally {
        setContactLoading(false);
    }
  }

  const averageRating = currentReviews && currentReviews.length > 0
    ? (currentReviews.reduce((acc, review) => acc + review.rating, 0) / currentReviews.length).toFixed(1)
    : venue.rating.toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
                <h1 className="text-2xl font-bold font-headline">{venue.name}</h1>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground mt-1 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span className="font-semibold text-foreground">{averageRating}</span>
                        <span>({currentReviews.length || venue.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{venue.location}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFavorite(venue)}
                    aria-label='Favorite'
                >
                    <Heart className={cn("w-3.5 h-3.5 mr-1.5", favorited && "fill-primary text-primary" )} />
                    {favorited ? "Favorited" : "Favorite"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleContactProvider} disabled={contactLoading}>
                    {contactLoading ? <Loader className="animate-spin mr-1.5" /> : <MessageSquare className="mr-1.5 h-3.5 w-3.5" />}
                    Contact
                </Button>
            </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8 -mx-4 md:mx-0">
        <Carousel>
            <CarouselContent>
                <CarouselItem>
                    <Image src={venue.image} alt={venue.name} width={800} height={500} className="object-cover w-full h-80 rounded-lg" data-ai-hint={venue.hint} />
                </CarouselItem>
                    {galleryImages.map((src, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Image src={src} alt={`Venue detail ${index + 1}`} width={400} height={300} className="object-cover w-full h-80 rounded-lg" data-ai-hint="banquet hall" />
                    </CarouselItem>
                    ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
        </Carousel>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-3">About this {venue.category}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
                {venue.name} is a premier provider of {venue.category.toLowerCase()} services, located in the heart of {venue.location}. With a stellar rating of {averageRating} from over {currentReviews.length || venue.reviewCount} clients, we pride ourselves on delivering exceptional experiences. Our space is perfect for weddings, corporate events, and private parties, offering a blend of elegance and modern amenities.
                <br/><br/>
                Our dedicated team works tirelessly to ensure every detail is perfect, from the initial planning stages to the final execution. We offer a range of packages to suit different needs and budgets, all designed to make your special day unforgettable.
            </p>

            <Separator className="my-6" />

            <h2 className="text-xl font-bold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {venue.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>{amenity}</span>
                    </div>
                ))}
            </div>

            <Separator className="my-6" />

            {/* Reviews Section */}
            <h2 className="text-xl font-bold mb-4">Reviews ({currentReviews.length})</h2>
            <div className="space-y-6">
                {currentReviews.map((review, index) => (
                    <div key={index} className="flex gap-4">
                        <Avatar className='h-9 w-9'>
                            <AvatarImage src={review.avatar} alt={review.authorName} />
                            <AvatarFallback>{review.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-sm">{review.authorName}</h4>
                                <div className="flex items-center">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
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
            <Card className="sticky top-20 shadow-lg">
                <CardHeader>
                    <CardTitle className='text-lg'>Request to Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xl font-bold">{venue.price}</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="date">Date</Label>
                             <Calendar
                                id="date"
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border p-0"
                                disabled={[
                                    ...bookedDates,
                                    ...pendingDates,
                                    { before: new Date() }
                                ]}
                                modifiers={{
                                    booked: bookedDates,
                                    pending: pendingDates,
                                }}
                                modifiersStyles={{
                                    booked: { 
                                        color: 'hsl(var(--destructive-foreground))',
                                        backgroundColor: 'hsl(var(--destructive-foreground) / 0.2)',
                                        textDecoration: 'line-through',
                                        opacity: 0.6,
                                     },
                                    pending: { 
                                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                                    }
                                }}
                            />
                        </div>
                         <div>
                            <Label htmlFor="guests">Number of Guests</Label>
                            <Input id="guests" type="number" placeholder="50" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                        </div>
                    </div>
                    <Button className="w-full mt-2" onClick={handleRequestBooking} disabled={loading}>
                        {loading ? <Loader className="animate-spin mr-2" /> : null}
                        Request to Book
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">You won&apos;t be charged yet</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    