
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, List, Loader, MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Listing extends DocumentData {
    id: string;
    name: string;
    category: string;
    // We use a placeholder image as the form doesn't handle uploads yet.
    // In a real app, this would come from the listing data.
    image?: string; 
    status: 'Published' | 'Pending' | 'Rejected';
}

const MyListingCard = ({ listing }: { listing: Listing }) => {
    const statusVariant = {
        Published: 'default',
        Pending: 'secondary',
        Rejected: 'destructive',
    } as const;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant={statusVariant[listing.status]} className="mb-2">{listing.status}</Badge>
                        <CardTitle className="text-lg">{listing.name}</CardTitle>
                        <CardDescription>{listing.category}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* In a real app, you'd use listing.image here */}
                <Image
                    src={listing.image || "https://placehold.co/600x400.png"}
                    alt={listing.name}
                    width={400}
                    height={200}
                    className="rounded-md object-cover aspect-video"
                    data-ai-hint="business office"
                />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View</Button>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Edit</Button>
                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
            </CardFooter>
        </Card>
    );
};


const EmptyState = () => (
     <div className="text-center border-dashed border-2 rounded-lg p-12">
        <div className="mx-auto w-fit bg-secondary p-3 rounded-full mb-4">
            <List className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">You haven't created any listings yet.</h3>
        <p className="text-muted-foreground mb-4">
            Add your service to our platform and start connecting with clients.
        </p>
        <Button asChild>
            <Link href="/add-listing">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Listing
            </Link>
        </Button>
    </div>
)

export default function MyListingsPage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(collection(db, 'listings'), where('ownerId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const fetchedListings = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    status: 'Published', // Mock status
                    ...doc.data()
                } as Listing));
                setListings(fetchedListings);
            } catch (error) {
                console.error("Error fetching listings: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <PageWrapper
            icon={List}
            title="My Listings"
            description="View and manage all the services you offer on our platform."
        >
            {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                        <MyListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}
        </PageWrapper>
    );
}
