
/**
 * To seed the database, run the following command from your terminal:
 * npx tsx src/lib/seed.ts
 * 
 * Make sure you have tsx installed globally or as a dev dependency.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, query, limit, doc, setDoc } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  "projectId": "venuevoyager-kga4a",
  "appId": "1:70267555311:web:fbd31ed89884df503afa1a",
  "storageBucket": "venuevoyager-kga4a.firebasestorage.app",
  "authDomain": "venuevoyager-kga4a.firebaseapp.com",
  "messagingSenderId": "70267555311",
  "measurementId": "G-11V622151G",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ownerIdForSeed = 'oF08A0WlxgM5Y31aBvoOaGYeS4y1';

const allVenuesData = [
    // Data from the original venues.ts file goes here...
    // Catering Services
    {
        name: "Gourmet Delights Catering",
        slug: "gourmet-delights-catering",
        location: "New York, NY",
        rating: 4.9,
        reviewCount: 150,
        price: "$120/person",
        priceValue: 120,
        image: "https://placehold.co/600x400.png",
        category: "Catering",
        hint: "catering food",
        guestCapacity: 200,
        amenities: ["In-house Catering", "Vegan Options", "Custom Menus", "Buffet Style"],
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "Gourmet Delights offers a premium catering experience, perfect for weddings, corporate events, and private parties. Our chefs use only the freshest ingredients to create memorable culinary masterpieces. We offer a wide range of customizable menus to suit any taste and dietary requirement, ensuring your event's dining is nothing short of spectacular."
    },
    // ... all other venue objects
    {
        name: "LA Elite Bartenders",
        slug: "la-elite-bartenders",
        location: "Los Angeles, CA",
        rating: 5.0,
        reviewCount: 250,
        price: "$50/hour per bartender",
        priceValue: 50,
        image: "https://placehold.co/600x400.png",
        category: "Event Staff",
        hint: "bartender",
        guestCapacity: 0,
        amenities: ["Mixologists", "Barbacks"],
        reviews: [],
        description: "Elevate your event with LA Elite Bartenders. Our team of professional, charismatic bartenders and mixologists are experts at crafting classic and innovative cocktails. We provide a complete bar service solution, ensuring your guests enjoy a sophisticated and seamless beverage experience."

    },
    {
        name: 'The Grand Ballroom',
        slug: 'the-grand-ballroom',
        location: 'New York, NY',
        rating: 4.8,
        reviewCount: 230,
        price: 'Starting from $10,000',
        priceValue: 10000,
        image: 'https://placehold.co/600x400.png',
        hint: 'ballroom',
        category: 'Venue',
        guestCapacity: 500,
        amenities: ["WiFi", "Parking", "In-house Catering", "AV Equipment", "Outdoor Space", "Bridal Suite"],
        guestFavorite: true,
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "The Grand Ballroom is an iconic New York City landmark, offering a breathtaking setting for any high-profile event. With its soaring ceilings, crystal chandeliers, and opulent decor, it provides a backdrop of unparalleled elegance. Our state-of-the-art facilities and dedicated event team ensure a flawless experience from start to finish."
    },
    {
        name: 'Sunset Cliff Venue',
        slug: 'sunset-cliff-venue',
        location: 'Malibu, CA',
        rating: 4.9,
        reviewCount: 180,
        price: 'Starting from $15,000',
        priceValue: 15000,
        image: 'https://placehold.co/600x400.png',
        hint: 'cliffs ocean',
        category: 'Venue',
        guestCapacity: 150,
        amenities: ["WiFi", "Parking", "AV Equipment", "Outdoor Space"],
        guestFavorite: false,
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "Perched atop the stunning cliffs of Malibu, Sunset Cliff Venue offers panoramic ocean views and a truly unforgettable location for your wedding or special event. The natural beauty of the Pacific Ocean provides a spectacular backdrop, while our modern, elegant facilities offer every comfort and convenience."
    },
    {
        name: 'Timeless Photography',
        slug: 'timeless-photography',
        location: 'Brooklyn, NY',
        rating: 4.9,
        reviewCount: 180,
        price: 'Packages from $3,500',
        priceValue: 3500,
        image: 'https://placehold.co/600x400.png',
        hint: 'camera photography',
        category: 'Photography',
        guestCapacity: 0,
        amenities: ["Videography", "Drone Photography", "Photo Booth"],
        guestFavorite: false,
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "At Timeless Photography, we specialize in capturing the fleeting moments that make your day special. Our style is a blend of photojournalism and fine art, creating a narrative of your event that is both authentic and beautiful. We are passionate about storytelling through images and providing you with memories that will last a lifetime."
    },
    {
        name: 'Elegant Eats Catering',
        slug: 'elegant-eats-catering',
        location: 'Chicago, IL',
        rating: 4.7,
        reviewCount: 120,
        price: '$150/person',
        priceValue: 150,
        image: 'https://placehold.co/600x400.png',
        hint: 'catering food',
        category: 'Catering',
        guestCapacity: 1000,
        amenities: ["Custom Menus", "Vegan Options", "Bar Service"],
        guestFavorite: true,
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "Elegant Eats Catering brings a touch of class and culinary excellence to every event. Based in Chicago, we are renowned for our innovative menus, exquisite presentation, and impeccable service. Whether it's an intimate gathering or a grand gala, we tailor our services to meet your unique needs and exceed your expectations."
    },
    {
        name: 'Luxe Limousines',
        slug: 'luxe-limousines',
        location: 'Miami, FL',
        rating: 4.9,
        reviewCount: 95,
        price: 'Starting at $200/hr',
        priceValue: 200,
        image: 'https://placehold.co/600x400.png',
        hint: 'limousine car',
        category: 'Transport',
        guestCapacity: 12,
        amenities: ["Champagne Service", "Sound System"],
        guestFavorite: false,
        reviews: [
            { rating: 5, authorName: 'John Doe', comment: 'Absolutely amazing food and service!', avatar: 'https://i.pravatar.cc/150?u=john-doe' },
            { rating: 4, authorName: 'Jane Smith', comment: 'Great variety and delicious options.', avatar: 'https://i.pravatar.cc/150?u=jane-smith' },
        ],
        description: "Arrive in style with Luxe Limousines. We offer a fleet of modern, luxurious vehicles to provide the perfect transportation for your event. Our professional chauffeurs are dedicated to providing a safe, comfortable, and elegant journey, ensuring you and your guests make a grand entrance."
    },
    {
        name: "Bloom & Blossom",
        slug: "bloom-and-blossom",
        location: "Austin, TX",
        rating: 4.9,
        reviewCount: 110,
        price: "Arrangements from $500",
        priceValue: 500,
        image: "https://placehold.co/600x400.png",
        hint: "flowers decor",
        category: "Decorations",
        guestCapacity: 0,
        amenities: ["Full Service Setup", "Custom Designs"],
        guestFavorite: true,
        reviews: [],
        description: "Bloom & Blossom creates stunning floral designs and decor that transform any space into a beautiful, immersive environment. Our talented designers work with you to bring your vision to life, using the freshest flowers and most creative concepts to craft breathtaking arrangements and installations."
    },
    {
        name: "DJ Sparkle",
        slug: "dj-sparkle",
        location: "Las Vegas, NV",
        rating: 4.8,
        reviewCount: 150,
        price: "$300/hour",
        priceValue: 300,
        image: "https://placehold.co/600x400.png",
        hint: "dj music",
        category: "Music",
        guestCapacity: 0,
        amenities: ["Lighting Included", "MC Services", "Custom Playlists"],
        guestFavorite: true,
        reviews: [],
        description: "Keep the party going with DJ Sparkle, one of Las Vegas's most sought-after event DJs. With a massive library spanning all genres and a knack for reading the crowd, DJ Sparkle ensures the dance floor is packed all night. Professional sound and lighting equipment are always included."
    },
    {
        name: "Chic Invitations",
        slug: "chic-invitations",
        location: "San Francisco, CA",
        rating: 5.0,
        reviewCount: 90,
        price: "Starting at $10/invite",
        priceValue: 10,
        image: "https://placehold.co/600x400.png",
        hint: "invitation card",
        category: "Invitations",
        guestCapacity: 0,
        amenities: ["Letterpress", "Foil Stamping", "Calligraphy"],
        guestFavorite: false,
        reviews: [],
        description: "Set the tone for your event with exquisite, custom-designed invitations from Chic Invitations. We offer a range of premium printing techniques, from classic letterpress to modern foil stamping, on the finest paper stocks. Our design team collaborates with you to create a beautiful first impression for your guests."
    }
];

const seedUsers = async () => {
    const userRef = doc(db, 'users', ownerIdForSeed);
    console.log(`Checking for user: ${ownerIdForSeed}`);
    
    // In a real scenario, we wouldn't check if user exists in auth.
    // This is just to create a corresponding profile doc in Firestore.
    try {
        await setDoc(userRef, {
            id: ownerIdForSeed,
            email: 'vendor@example.com',
            role: 'user_vendor',
            profile: {
                firstName: 'Test',
                lastName: 'Vendor',
                location: { city: "New York", state: "NY", country: "USA" }
            },
            vendorProfile: {
                businessName: 'Test Vendor Inc.',
                businessType: 'company',
            }
        });
        console.log(`Seeded user profile for ${ownerIdForSeed}`);
    } catch(e) {
        console.error(`Could not seed user ${ownerIdForSeed}`, e)
    }
}

async function seedDatabase() {
    const listingsRef = collection(db, "listings");
    console.log("Checking if database is already seeded...");

    // Check if there's already data to avoid re-seeding
    const q = query(listingsRef, limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        console.log("Database already contains data. Seeding aborted.");
        return;
    }

    console.log("Seeding user data...");
    await seedUsers();

    console.log("Seeding listings... This may take a moment.");
    const batch = writeBatch(db);

    allVenuesData.forEach((venue) => {
        // Use the slug as the document ID for easy retrieval
        const docRef = doc(listingsRef, venue.slug);
        batch.set(docRef, { ...venue, ownerId: ownerIdForSeed });
    });

    try {
        await batch.commit();
        console.log(`Successfully seeded ${allVenuesData.length} listings.`);
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}

seedDatabase().then(() => {
    console.log("Seeding process finished.");
    // Firestore doesn't require a process.exit() like some DB connections.
    // The script will terminate naturally.
}).catch(e => {
    console.error("Seeding script failed", e);
});
