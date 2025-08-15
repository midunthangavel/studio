
'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUploader } from '../file-uploader';

export function CateringForm() {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Catering Service Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Gourmet Delights Catering" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="ownerName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g., contact@gourmet.com" {...field} /></FormControl>
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
                        <FormLabel>Location / Address</FormLabel>
                        <FormControl><Textarea placeholder="Provide your primary service address or area." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="guestCapacity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maximum Guest Capacity</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="costPerPerson"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Average Cost Per Person ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 85" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="advanceAmount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Advance / Deposit Amount Required ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="staffCount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Serving Staff Provided</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="dietaryOptions"
                render={() => (
                    <FormItem>
                        <FormLabel>Dietary Options</FormLabel>
                        <div className="flex items-center space-x-4">
                            <FormField
                                control={control}
                                name="dietaryOptions.veg"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <FormLabel className="font-normal">Vegetarian</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="dietaryOptions.nonVeg"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <FormLabel className="font-normal">Non-Vegetarian</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="menuOptions"
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel>Menu Flexibility</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="fixed" /></FormControl><FormLabel className="font-normal">Fixed Menu</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="flexible" /></FormControl><FormLabel className="font-normal">Flexible / Custom Menu</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="serviceStyle"
                render={({ field }) => (
                     <FormItem className="space-y-2">
                        <FormLabel>Service Style</FormLabel>
                        <FormControl>
                             <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="on-site" /></FormControl><FormLabel className="font-normal">Cook On-Site</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="delivery" /></FormControl><FormLabel className="font-normal">Deliver Pre-made Food</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Menu Details & Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your service and provide sample menu items..." rows={5} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="photos"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Showcase Your Work</FormLabel>
                        <FormControl><FileUploader onFileSelect={(files) => field.onChange(files)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
