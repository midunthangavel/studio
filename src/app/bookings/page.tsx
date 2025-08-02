
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { PageWrapper } from "@/components/page-wrapper";

const upcomingBookings = [
    {
        id: "BK12345",
        name: "The Grand Palace - Wedding Reception",
        date: "October 26, 2024",
        location: "New York, NY",
        status: "Confirmed",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&h=400&fit=crop",
        hint: "wedding reception"
    },
    {
        id: "BK67890",
        name: "Gourmet Delights - Catering Service",
        date: "October 26, 2024",
        location: "New York, NY",
        status: "Confirmed",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&h=400&fit=crop",
        hint: "catering food"
    }
];

const pastBookings = [
    {
        id: "BK54321",
        name: "Lakeside Manor - Birthday Party",
        date: "July 15, 2023",
        location: "Chicago, IL",
        status: "Completed",
        image: "https://images.unsplash.com/photo-1519225421980-715cb02cf58c?q=80&w=600&h=400&fit=crop",
        hint: "outdoor wedding"
    }
];

export default function BookingsPage() {
  return (
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
                    <Card key={booking.id}>
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <Image src={booking.image} alt={booking.name} width={600} height={300} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.hint} />
                            </div>
                            <div className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{booking.name}</CardTitle>
                                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                                        </div>
                                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {booking.location}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm">View Details</Button>
                                        <Button size="sm" variant="outline">Contact Provider</Button>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming bookings.</p>
            )}
            </div>
        </TabsContent>
        <TabsContent value="past">
            <div className="space-y-6 mt-6">
            {pastBookings.length > 0 ? (
                pastBookings.map(booking => (
                    <Card key={booking.id} className="opacity-70">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <Image src={booking.image} alt={booking.name} width={600} height={300} className="object-cover h-full w-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" data-ai-hint={booking.hint} />
                            </div>
                            <div className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{booking.name}</CardTitle>
                                            <CardDescription>Booking ID: {booking.id}</CardDescription>
                                        </div>
                                        <Badge variant="secondary">{booking.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-center text-sm text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {booking.location}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline">Leave a Review</Button>
                                        <Button size="sm" variant="outline">View Receipt</Button>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                 <p className="text-muted-foreground text-center py-8">No past bookings.</p>
            )}
            </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
