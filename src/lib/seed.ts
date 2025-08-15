
/**
 * To seed the database, run the following command from your terminal:
 * npx tsx src/lib/seed.ts
 * 
 * Make sure you have tsx installed globally or as a dev dependency.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, getDocs, query, limit } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  "projectId": "venuevoyager-kga4a",
  "appId": "1:70267555311:web:fbd31ed89884df503afa1a",
  "storageBucket": "venuevoyager-kga4a.firebasestorage.app",
  "authDomain": "venuevoyager-kga4a.firebaseapp.com",
  "messagingSenderId": "70267555311",
  "measurementId": "G-11V622151G",
  // IMPORTANT: For server-side scripts, you might need a service account.
  // For this simple script, we assume you're running it in an environment
  // where you have authenticated with Firebase CLI or have set up application default credentials.
  // Using API keys in server-side scripts is not recommended.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    }
];

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

    console.log("Seeding database... This may take a moment.");
    const batch = writeBatch(db);

    allVenuesData.forEach((venue) => {
        // Use the slug as the document ID for easy retrieval
        const docRef = doc(listingsRef, venue.slug);
        batch.set(docRef, venue);
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
});
