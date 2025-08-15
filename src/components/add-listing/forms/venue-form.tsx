
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUploader } from '../file-uploader';
import { AvailabilityCalendar } from '../availability-calendar';

const amenities = ['WiFi', 'Parking', 'In-house Catering', 'AV Equipment', 'Outdoor Space', 'Bridal Suite'];

export function VenueForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl><Input placeholder="e.g., The Grand Palace" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Booking Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g., events@thegrandpalace.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl><Input type="tel" placeholder="e.g., (123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue Address</FormLabel>
                        <FormControl><Input placeholder="e.g., 123 Celebration Ave, New York, NY" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="guestCapacity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Guest Capacity</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 300" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="pricing"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rental Fee / Pricing Structure</FormLabel>
                        <FormControl><Input placeholder="e.g., $10,000 for 8 hours" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="amenities"
                render={() => (
                    <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {amenities.map((item) => (
                                <FormField
                                    key={item}
                                    control={control}
                                    name={`amenities.${item}`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your venue's atmosphere, features, and what makes it special for events." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="availability"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Set Your Availability Calendar</FormLabel>
                        <FormControl><AvailabilityCalendar onUpdate={field.onChange} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="photos"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue Photos</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
