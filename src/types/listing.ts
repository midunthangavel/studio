
import { z } from 'zod';

export const categories = ['Venue', 'Decorations', 'Catering', 'Photography', 'Transport', 'Legal', 'Music', 'Invitations', 'Planner'] as const;
export type Category = typeof categories[number];

const fileSchema = z.custom<File>((val) => val instanceof File, "Please upload a file");

const baseSchema = z.object({
  category: z.enum(categories),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional(),
  address: z.string().min(5, "Please enter a valid address or service area."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  photos: z.array(fileSchema).max(10, "You can upload a maximum of 10 photos.").optional(),
});

const venueSchema = baseSchema.extend({
  category: z.literal('Venue'),
  guestCapacity: z.coerce.number().positive("Guest capacity must be a positive number."),
  pricing: z.string().min(1, "Pricing details are required."),
  amenities: z.object({}).catchall(z.boolean()).optional(),
  availability: z.any().optional(),
});

const cateringSchema = baseSchema.extend({
    category: z.literal('Catering'),
    ownerName: z.string().min(2, "Owner name is required."),
    guestCapacity: z.coerce.number().positive(),
    costPerPerson: z.coerce.number().positive(),
    advanceAmount: z.coerce.number().positive(),
    staffCount: z.coerce.number().int().positive(),
    dietaryOptions: z.object({ veg: z.boolean(), nonVeg: z.boolean() }).optional(),
    menuOptions: z.enum(['fixed', 'flexible']),
    serviceStyle: z.enum(['on-site', 'delivery']),
});

const photographySchema = baseSchema.extend({
    category: z.literal('Photography'),
    website: z.string().url().optional().or(z.literal('')),
    pricing: z.coerce.number().positive("Starting price is required."),
    photoStyles: z.object({}).catchall(z.boolean()).optional(),
    servicesOffered: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
});

const transportSchema = baseSchema.extend({
    category: z.literal('Transport'),
    pricing: z.string().min(1, "Pricing model is required."),
    vehicleTypes: z.object({}).catchall(z.boolean()).optional(),
    amenities: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
});

const decorationsSchema = baseSchema.extend({
    category: z.literal('Decorations'),
    pricing: z.string().min(1, "Pricing model is required."),
    decorationTypes: z.object({}).catchall(z.boolean()).optional(),
    fullService: z.boolean().optional(),
});

const legalSchema = baseSchema.extend({
    category: z.literal('Legal'),
    barNumber: z.string().optional(),
    pricing: z.string().min(1, "Pricing structure is required."),
    legalServices: z.object({}).catchall(z.boolean()).optional(),
});

const musicSchema = baseSchema.extend({
    category: z.literal('Music'),
    pricing: z.string().min(1, "Pricing information is required."),
    canEmcee: z.boolean().optional(),
    musicGenres: z.object({}).catchall(z.boolean()).optional(),
    equipmentProvided: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
});

const invitationsSchema = baseSchema.extend({
    category: z.literal('Invitations'),
    website: z.string().url().optional().or(z.literal('')),
    pricing: z.coerce.number().positive("Starting price is required."),
    minOrder: z.coerce.number().positive("Minimum order quantity is required."),
    designServices: z.object({}).catchall(z.boolean()).optional(),
});

const plannerSchema = baseSchema.extend({
    category: z.literal('Planner'),
    website: z.string().url().optional().or(z.literal('')),
    pricing: z.string().min(1, "Pricing model is required."),
    planningServices: z.object({}).catchall(z.boolean()).optional(),
    eventTypes: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
});


export const listingSchema = z.discriminatedUnion("category", [
    venueSchema,
    cateringSchema,
    photographySchema,
    transportSchema,
    decorationsSchema,
    legalSchema,
    musicSchema,
    invitationsSchema,
    plannerSchema,
]);

export type ListingFormValues = z.infer<typeof listingSchema>;
