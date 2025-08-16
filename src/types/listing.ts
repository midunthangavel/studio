
import { z } from 'zod';

export const categories = ['Venue', 'Decorations', 'Catering', 'Photography', 'Transport', 'Legal', 'Music', 'Invitations', 'Planner', 'Event Staff'] as const;
export type Category = typeof categories[number];

const fileSchema = z.custom<File>((val) => val instanceof File, "Please upload a file");

const baseSchema = z.object({
  category: z.enum(categories),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  slug: z.string().min(3),
  email: z.string().email("Please enter a valid email address.").optional(),
  phone: z.string().min(10, "Please enter a valid phone number.").optional(),
  address: z.string().min(5, "Please enter a valid address or service area.").optional(),
  location: z.string().min(2),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  photos: z.array(fileSchema).max(10, "You can upload a maximum of 10 photos.").optional(),
  image: z.string().url(),
  hint: z.string(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  price: z.string(),
  priceValue: z.number(),
  guestFavorite: z.boolean().optional(),
  reviews: z.array(z.object({
      rating: z.number().min(1).max(5),
      comment: z.string(),
      authorName: z.string(),
      avatar: z.string().url().optional(),
  })).optional(),
});

const venueSchema = baseSchema.extend({
  category: z.literal('Venue'),
  guestCapacity: z.coerce.number().positive("Guest capacity must be a positive number."),
  amenities: z.array(z.string()).optional(),
  availability: z.any().optional(),
});

const cateringSchema = baseSchema.extend({
    category: z.literal('Catering'),
    ownerName: z.string().min(2, "Owner name is required.").optional(),
    guestCapacity: z.coerce.number().positive(),
    costPerPerson: z.coerce.number().positive().optional(),
    advanceAmount: z.coerce.number().positive().optional(),
    staffCount: z.coerce.number().int().positive().optional(),
    dietaryOptions: z.object({ veg: z.boolean(), nonVeg: z.boolean() }).optional(),
    menuOptions: z.enum(['fixed', 'flexible']).optional(),
    serviceStyle: z.enum(['on-site', 'delivery']).optional(),
    amenities: z.array(z.string()).optional(),
});

const photographySchema = baseSchema.extend({
    category: z.literal('Photography'),
    website: z.string().url().optional().or(z.literal('')),
    photoStyles: z.object({}).catchall(z.boolean()).optional(),
    servicesOffered: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.array(z.string()).optional(),
});

const transportSchema = baseSchema.extend({
    category: z.literal('Transport'),
    vehicleTypes: z.object({}).catchall(z.boolean()).optional(),
    amenities: z.array(z.string()).optional(),
    availability: z.any().optional(),
});

const decorationsSchema = baseSchema.extend({
    category: z.literal('Decorations'),
    decorationTypes: z.object({}).catchall(z.boolean()).optional(),
    fullService: z.boolean().optional(),
    amenities: z.array(z.string()).optional(),
});

const legalSchema = baseSchema.extend({
    category: z.literal('Legal'),
    barNumber: z.string().optional(),
    legalServices: z.object({}).catchall(z.boolean()).optional(),
    amenities: z.array(z.string()).optional(),
});

const musicSchema = baseSchema.extend({
    category: z.literal('Music'),
    canEmcee: z.boolean().optional(),
    musicGenres: z.object({}).catchall(z.boolean()).optional(),
    equipmentProvided: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.array(z.string()).optional(),
});

const invitationsSchema = baseSchema.extend({
    category: z.literal('Invitations'),
    website: z.string().url().optional().or(z.literal('')),
    minOrder: z.coerce.number().positive("Minimum order quantity is required.").optional(),
    designServices: z.object({}).catchall(z.boolean()).optional(),
    amenities: z.array(z.string()).optional(),
});

const plannerSchema = baseSchema.extend({
    category: z.literal('Planner'),
    website: z.string().url().optional().or(z.literal('')),
    planningServices: z.object({}).catchall(z.boolean()).optional(),
    eventTypes: z.object({}).catchall(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.array(z.string()).optional(),
});

const eventStaffSchema = baseSchema.extend({
  category: z.literal('Event Staff'),
  amenities: z.array(z.string()).optional(),
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
    eventStaffSchema,
]);

export type ListingFormValues = z.infer<typeof listingSchema>;
