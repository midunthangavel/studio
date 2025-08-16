
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, DocumentData, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, List, Loader, MoreVertical, PlusCircle, Trash2, DollarSign, BarChart2, Star, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/types/listing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Booking extends DocumentData {
    id: string;
    venueName: string;
    bookingDate: {
        toDate: () => Date;
    };
    guestCount: number;
    status: 'Pending' | 'Confirmed' | 'Declined';
    userName: string;
    userId: string;
}

const MyListingRow = ({ listing }: { listing: Listing }) => {
    const statusVariant = {
        active: 'default',
        pending: 'secondary',
        inactive: 'destructive',
    } as const;

    return (
        <TableRow>
            <TableCell>
                 <div className="flex items-center gap-3">
                    <Image
                        src={listing.image || "https://placehold.co/600x400.png"}
                        alt={listing.name}
                        width={60}
                        height={40}
                        className="rounded-md object-cover"
                        data-ai-hint="business office"
                    />
                    <div>
                         <div className="font-medium">{listing.name}</div>
                         <div className="text-muted-foreground text-xs">{listing.category}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                 <Badge variant={statusVariant[listing.status as keyof typeof statusVariant] || 'secondary'} className="capitalize">{listing.status}</Badge>
            </TableCell>
            <TableCell>{listing.price || '$0'}</TableCell>
            <TableCell className="text-center">{listing.analytics?.viewCount || 0}</TableCell>
            <TableCell className="text-center">{listing.analytics?.inquiryCount || 0}</TableCell>
             <TableCell className="text-center">{listing.analytics?.bookingCount || 0}</TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </TableCell>
        </TableRow>
    );
};

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const BookingsTable = ({ bookings, onStatusChange }: { bookings: Booking[], onStatusChange: (id: string, status: 'Confirmed' | 'Declined') => void }) => {
    const handleStatusUpdate = async (bookingId: string, newStatus: 'Confirmed' | 'Declined') => {
        onStatusChange(bookingId, newStatus);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Incoming Bookings</CardTitle>
                <CardDescription>Manage booking requests from users.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell className='font-medium'>{booking.venueName}</TableCell>
                                    <TableCell>{booking.userName || 'N/A'}</TableCell>
                                    <TableCell>{format(booking.bookingDate.toDate(), 'PPP')}</TableCell>
                                    <TableCell>{booking.guestCount}</TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'Confirmed' ? 'default' : (booking.status === 'Declined' ? 'destructive' : 'secondary')}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {booking.status === 'Pending' && (
                                            <div className='flex gap-2 justify-end'>
                                                <Button size="icon" variant="outline" className='h-7 w-7' onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}><Check className='h-4 w-4' /></Button>
                                                <Button size="icon" variant="destructive" className='h-7 w-7' onClick={() => handleStatusUpdate(booking.id, 'Declined')}><X className='h-4 w-4' /></Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No incoming bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}

export default function VendorDashboardPage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [listings, setListings] = useState<Listing[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        if (profile && profile.role !== 'vendor' && profile.role !== 'user_vendor') {
            router.push('/profile');
        }
    }, [profile, router]);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                // Fetch listings owned by the vendor
                const listingsQuery = query(collection(db, 'listings'), where('ownerId', '==', user.uid));
                const listingsSnapshot = await getDocs(listingsQuery);
                const fetchedListings = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                setListings(fetchedListings);

                // Fetch bookings for those listings
                if (fetchedListings.length > 0) {
                    const listingSlugs = fetchedListings.map(l => l.slug);
                    const bookingsQuery = query(collection(db, 'bookings'), where('venueId', 'in', listingSlugs));
                    const bookingsSnapshot = await getDocs(bookingsQuery);
                    const fetchedBookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
                    setBookings(fetchedBookings);
                }

            } catch (error) {
                console.error("Error fetching dashboard data: ", error);
                 toast({ variant: 'destructive', title: 'Error', description: 'Failed to load dashboard data.' });
            } finally {
                setLoading(false);
            }
        }

        if (user && profile) {
            fetchDashboardData();
        }
    }, [user, profile, toast]);

    const handleBookingStatusChange = async (bookingId: string, status: 'Confirmed' | 'Declined') => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status });

            const updatedBooking = bookings.find(b => b.id === bookingId);
            if(updatedBooking) {
                 await addDoc(collection(db, 'notifications'), {
                    userId: updatedBooking.userId,
                    type: 'Booking Update',
                    message: `Your booking for ${updatedBooking.venueName} has been ${status.toLowerCase()}.`,
                    timestamp: serverTimestamp(),
                    read: false,
                    iconName: 'Booking Update'
                });
            }

            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
            toast({ title: 'Booking Updated', description: `The booking has been successfully ${status.toLowerCase()}.` });
        } catch (error) {
            console.error("Error updating booking status:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update booking status.' });
        }
    }

    const totalRevenue = useMemo(() => {
        // This is a mock calculation. In a real app, you'd pull this from booking data.
        return listings.reduce((acc, l) => acc + (l.priceValue || 0) * (l.analytics?.bookingCount || 0), 0);
    }, [listings]);

    const totalBookings = useMemo(() => {
        return listings.reduce((acc, l) => acc + (l.analytics?.bookingCount || 0), 0);
    }, [listings]);

    const averageRating = useMemo(() => {
        const ratings = listings.map(l => l.rating || 0).filter(r => r > 0);
        if (ratings.length === 0) return 'N/A';
        const avg = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
        return avg.toFixed(1);
    }, [listings]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <ProtectedRoute>
            <PageWrapper
                icon={List}
                title="Vendor Dashboard"
                description="Monitor your business performance and manage your listings."
            >
             <Tabs defaultValue="overview">
                 <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard title="Total Revenue (Mock)" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
                        <StatCard title="Total Bookings (Mock)" value={`+${totalBookings}`} icon={BarChart2} />
                        <StatCard title="Average Rating" value={averageRating} icon={Star} />
                    </div>
                    <Card>
                        <CardHeader className='flex flex-row justify-between items-center'>
                        <div>
                            <CardTitle>My Listings</CardTitle>
                            <CardDescription>An overview of all your services.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/add-listing">
                                <PlusCircle className='mr-2 h-4 w-4' />
                                Add Listing
                            </Link>
                        </Button>
                        </CardHeader>
                        <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Listing</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-center">Views</TableHead>
                                    <TableHead className="text-center">Inquiries</TableHead>
                                    <TableHead className="text-center">Bookings</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.length > 0 ? (
                                    listings.map(listing => (
                                        <MyListingRow key={listing.id} listing={listing} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No listings found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="bookings">
                    <BookingsTable bookings={bookings} onStatusChange={handleBookingStatusChange} />
                </TabsContent>
             </Tabs>
            </PageWrapper>
        </ProtectedRoute>
    );
}

    