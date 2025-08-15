
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { listingSchema, Category } from '@/types/listing';

// Lazy load forms to improve initial page load
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { Separator } from '../ui/separator';
const LoadingComponent = () => <div className='flex justify-center items-center py-10'><Loader className='animate-spin' /></div>;

const VenueForm = dynamic(() => import('./forms/venue-form').then(mod => mod.VenueForm), { loading: LoadingComponent });
const CateringForm = dynamic(() => import('./forms/catering-form').then(mod => mod.CateringForm), { loading: LoadingComponent });
const PhotographyForm = dynamic(() => import('./forms/photography-form').then(mod => mod.PhotographyForm), { loading: LoadingComponent });
const TransportForm = dynamic(() => import('./forms/transport-form').then(mod => mod.TransportForm), { loading: LoadingComponent });
const DecorationsForm = dynamic(() => import('./forms/decorations-form').then(mod => mod.DecorationsForm), { loading: LoadingComponent });
const LegalForm = dynamic(() => import('./forms/legal-form').then(mod => mod.LegalForm), { loading: LoadingComponent });
const MusicForm = dynamic(() => import('./forms/music-form').then(mod => mod.MusicForm), { loading: LoadingComponent });
const InvitationsForm = dynamic(() => import('./forms/invitations-form').then(mod => mod.InvitationsForm), { loading: LoadingComponent });
const PlannerForm = dynamic(() => import('./forms/planner-form').then(mod => mod.PlannerForm), { loading: LoadingComponent });


const categories: { value: Category; label: string }[] = [
    { value: 'Venue', label: 'Venues / Halls' },
    { value: 'Decorations', label: 'Decorations' },
    { value: 'Catering', label: 'Catering' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Legal', label: 'Legal Matters' },
    { value: 'Music', label: 'Music / DJ' },
    { value: 'Invitations', label: 'Invitations' },
    { value: 'Planner', label: 'Event Planners' },
];

const categoryFormMap: Record<Category, React.ComponentType<any>> = {
    Venue: VenueForm,
    Catering: CateringForm,
    Photography: PhotographyForm,
    Transport: TransportForm,
    Decorations: DecorationsForm,
    Legal: LegalForm,
    Music: MusicForm,
    Invitations: InvitationsForm,
    Planner: PlannerForm,
};

export function AddListingForm() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const form = useForm({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            category: undefined,
            // Initialize other fields with default values
            name: '',
            ownerName: '',
            email: '',
            phone: '',
            address: '',
            description: '',
            // ... other common fields
        },
    });

    const handleCategoryChange = (value: string) => {
        const category = value as Category;
        setSelectedCategory(category);
        form.setValue('category', category);
        form.reset({
            category,
            name: '',
            ownerName: '',
            email: '',
            phone: '',
            address: '',
            description: '',
        });
    };

    function onSubmit(values: any) {
        // In a real application, this would send data to Firestore
        console.log('Form submitted:', values);
        alert('Form submitted! Check the console for the data.');
    }

    const SelectedForm = selectedCategory ? categoryFormMap[selectedCategory] : null;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Your Service Category</CardTitle>
                        <CardDescription>Choose the type of service you are offering to see the relevant fields.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Service Category</FormLabel>
                                <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                {SelectedForm && (
                   <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                            <CardDescription>Please provide the specific details for your {selectedCategory?.toLowerCase()} service.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SelectedForm />
                        </CardContent>
                    </Card>
                )}

                {selectedCategory && (
                     <div className="flex justify-end">
                        <Button type="submit">Submit Listing</Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
