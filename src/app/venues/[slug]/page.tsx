
'use client';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Wifi, ParkingSquare, Utensils, Wind, Calendar as CalendarIcon, Heart, Loader, MessageSquare } from 'lucide-react';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { allVenues } from '@/lib/venues';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFavorites } from '@/context/favorites-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

const galleryImages = [
    "https://images.unsplash.com/photo-1519688034509-3f5f3ab4349e?q=80&w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520854221256-17452cc6da82?q=80&w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1579683348053-14b1c5a942ce?q=80&w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512295767273-b684ac69f887?q=80&w=400&h=300&fit=crop",
]

export default function VenueDetailPage({ params }: { params: { slug: string } }) {
  const venue = allVenues.find(v => v.slug === params.slug);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(50);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  if (!venue) {
    notFound();
  }

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
        // Mock provider ID - in a real app, this would be on the venue object
        const providerId = `provider_${venue.slug}`; 
        
        // Create a unique conversation ID
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{venue.name}</h1>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">{venue.rating}</span>
                        <span>({venue.reviewCount} reviews)</span>
                    </div>
                    <span className="hidden md:block text-muted-foreground/50">|</span>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{venue.location}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 md:hidden">
                 <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleFavorite(venue)}
                    aria-label='Favorite'
                >
                    <Heart className={cn("w-4 h-4 mr-2", favorited && "fill-primary text-primary" )} />
                    {favorited ? "Favorited" : "Favorite"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleContactProvider} disabled={contactLoading}>
                    {contactLoading ? <Loader className="animate-spin mr-2" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                    Contact
                </Button>
            </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-12">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 gap-2">
            <div className="col-span-1">
                <Image src={venue.image} alt={venue.name} width={800} height={600} className="rounded-lg object-cover w-full h-full" data-ai-hint={venue.hint} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                {galleryImages.map((src, index) => (
                     <Image key={index} src={src} alt={`Venue detail ${index + 1}`} width={400} height={300} className="rounded-lg object-cover w-full h-full" data-ai-hint="banquet hall" />
                ))}
            </div>
        </div>
        {/* Mobile Carousel */}
        <div className="md:hidden -mx-4">
            <Carousel>
                <CarouselContent>
                    <CarouselItem>
                        <Image src={venue.image} alt={venue.name} width={800} height={600} className="object-cover w-full h-64" data-ai-hint={venue.hint} />
                    </CarouselItem>
                     {galleryImages.map((src, index) => (
                        <CarouselItem key={index}>
                           <Image src={src} alt={`Venue detail ${index + 1}`} width={800} height={600} className="object-cover w-full h-64" data-ai-hint="banquet hall" />
                        </CarouselItem>
                     ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
             <Separator className="my-8 hidden md:block" />
             <div className='hidden md:flex items-center gap-2'>
                <Button variant="outline" onClick={handleContactProvider} disabled={contactLoading}>
                    {contactLoading ? <Loader className="animate-spin mr-2" /> : <MessageSquare className="mr-2" />}
                    Contact Provider
                </Button>
                 <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(venue)}
                    aria-label='Favorite'
                >
                    <Heart className={cn("w-5 h-5 mr-2", favorited && "fill-primary text-primary" )} />
                    {favorited ? 'Favorited' : 'Favorite'}
                </Button>
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
                                id="date"
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border p-0 [&_button]:w-full"
                                styles={{
                                    day: { width: '100%' }
                                }}

                            />
                        </div>
                         <div>
                            <Label htmlFor="guests">Number of Guests</Label>
                            <Input id="guests" type="number" placeholder="50" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                        </div>
                    </div>
                    <Button size="lg" className="w-full mt-4" onClick={handleRequestBooking} disabled={loading}>
                        {loading ? <Loader className="animate-spin mr-2" /> : null}
                        Request to Book
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">You won&apos;t be charged yet</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    
