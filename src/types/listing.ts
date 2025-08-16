
import { z } from 'zod';

export const categories = ['Venue', 'Decorations', 'Catering', 'Photography', 'Transport', 'Legal', 'Music', 'Invitations', 'Planner', 'Event Staff'] as const;
export type Category = typeof categories[number];

const fileSchema = z.custom<File>((val) => val instanceof File, "Please upload a file");

const baseSchema = z.object({
  category: z.enum(categories),
  name: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.string().email("Please enter a valid email address.").optional(),
  phone: z.string().min(10, "Please enter a valid phone number.").optional(),
  address: z.string().min(5, "Please enter a valid address or service area.").optional(),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  photos: z.array(fileSchema).max(10, "You can upload a maximum of 10 photos.").optional(),
  
  // Fields to be populated programmatically, not via form
  slug: z.string().optional(),
  ownerId: z.string().optional(),
  location: z.string().optional(),
  image: z.string().url().optional(),
  hint: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  price: z.string().optional(),
  priceValue: z.number().optional(),
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
  amenities: z.record(z.boolean()).optional(),
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
    amenities: z.record(z.boolean()).optional(),
});

const photographySchema = baseSchema.extend({
    category: z.literal('Photography'),
    website: z.string().url().optional().or(z.literal('')),
    photoStyles: z.record(z.boolean()).optional(),
    servicesOffered: z.record(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.record(z.boolean()).optional(),
});

const transportSchema = baseSchema.extend({
    category: z.literal('Transport'),
    pricing: z.string().optional(), // Adding pricing to match the form
    vehicleTypes: z.record(z.boolean()).optional(),
    amenities: z.record(z.boolean()).optional(),
    availability: z.any().optional(),
});

const decorationsSchema = baseSchema.extend({
    category: z.literal('Decorations'),
    pricing: z.string().optional(), // Adding pricing to match the form
    decorationTypes: z.record(z.boolean()).optional(),
    fullService: z.boolean().optional(),
    amenities: z.record(z.boolean()).optional(),
});

const legalSchema = baseSchema.extend({
    category: z.literal('Legal'),
    pricing: z.string().optional(), // Adding pricing to match the form
    barNumber: z.string().optional(),
    legalServices: z.record(z.boolean()).optional(),
    amenities: z.record(z.boolean()).optional(),
});

const musicSchema = baseSchema.extend({
    category: z.literal('Music'),
    pricing: z.string().optional(), // Adding pricing to match the form
    canEmcee: z.boolean().optional(),
    musicGenres: z.record(z.boolean()).optional(),
    equipmentProvided: z.record(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.record(z.boolean()).optional(),
});

const invitationsSchema = baseSchema.extend({
    category: z.literal('Invitations'),
    pricing: z.coerce.number().positive().optional(), // Renamed from starting price
    website: z.string().url().optional().or(z.literal('')),
    minOrder: z.coerce.number().positive("Minimum order quantity is required.").optional(),
    designServices: z.record(z.boolean()).optional(),
    amenities: z.record(z.boolean()).optional(),
});

const plannerSchema = baseSchema.extend({
    category: z.literal('Planner'),
    pricing: z.string().optional(), // Adding pricing to match the form
    website: z.string().url().optional().or(z.literal('')),
    planningServices: z.record(z.boolean()).optional(),
    eventTypes: z.record(z.boolean()).optional(),
    availability: z.any().optional(),
    amenities: z.record(z.boolean()).optional(),
});

const eventStaffSchema = baseSchema.extend({
  category: z.literal('Event Staff'),
  amenities: z.record(z.boolean()).optional(),
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
export type Listing = z.infer<typeof baseSchema> & { id: string, [key: string]: any };
