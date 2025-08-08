
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Loader, MapPin } from "lucide-react";
import Image from "next/image";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Booking {
    id: string;
    venueName: string;
    venueImage: string;
    venueLocation: string;
    venueHint: string;
    bookingDate: Timestamp;
    status: string;
}

function BookingsPage() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) {
        setLoading(false);
        return;
      };

      try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const bookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });

        const now = new Date();
        const upcoming = bookings.filter(b => b.bookingDate && b.bookingDate.toDate() >= now);
        const past = bookings.filter(b => b.bookingDate && b.bookingDate.toDate() < now);
        
        setUpcomingBookings(upcoming.sort((a, b) => a.bookingDate.toDate().getTime() - b.bookingDate.toDate().getTime()));
        setPastBookings(past.sort((a, b) => b.bookingDate.toDate().getTime() - a.bookingDate.toDate().getTime()));

      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
                <Image src={booking.venueImage} alt={booking.venueName} width={600} height={300} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.venueHint} />
            </div>
            <div className="md:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{booking.venueName}</CardTitle>
                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </div>
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {booking.bookingDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || 'Date not set'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.venueLocation}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm" variant="outline">Contact Provider</Button>
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
  )

  const PastBookingCard = ({ booking }: { booking: Booking }) => (
     <Card className="opacity-70">
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
                <Image src={booking.venueImage} alt={booking.venueName} width={600} height={300} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.venueHint} />
            </div>
            <div className="md:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{booking.venueName}</CardTitle>
                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {booking.bookingDate?.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || 'Date not set'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.venueLocation}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">Leave a Review</Button>
                        <Button size="sm" variant="outline">View Receipt</Button>
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
  )

  const EmptyState = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
     <div className="border-dashed border rounded-lg">
        <div className="p-10 text-center">
            <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">
            {description}
            </p>
        </div>
    </div>
  )

  return (
    <ProtectedRoute>
    <PageWrapper
        icon={Calendar}
        title="My Bookings"
        description="Manage your upcoming and past bookings for your functions."
    >
      <Tabs defaultValue="upcoming" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="space-y-6 mt-6">
            {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                   <BookingCard key={booking.id} booking={booking} />
                ))
            ) : (
                <EmptyState 
                    icon={Calendar}
                    title="No Upcoming Bookings"
                    description="You have no upcoming bookings. Why not explore some venues?"
                />
            )}
            </div>
        </TabsContent>
        <TabsContent value="past">
            <div className="space-y-6 mt-6">
            {pastBookings.length > 0 ? (
                pastBookings.map(booking => (
                   <PastBookingCard key={booking.id} booking={booking} />
                ))
            ) : (
               <EmptyState 
                    icon={CheckCircle}
                    title="No Past Bookings"
                    description="You have no past bookings."
                />
            )}
            </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
    </ProtectedRoute>
  );
}

export default BookingsPage;
