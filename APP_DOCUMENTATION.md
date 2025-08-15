# VenueVoyager: Complete Application Documentation

This document provides a comprehensive, detailed breakdown of the "VenueVoyager" application, covering its architecture, design philosophy, features, and complete user flow.

### 1. High-Level Application Concept

**VenueVoyager** is a sophisticated, AI-driven, two-sided marketplace designed to streamline the event planning process. It connects users (event planners) with a diverse range of vendors providing services like venues, catering, photography, and more. Its core mission is to replace the stress of event planning with a creative, intuitive, and intelligent platform. The app is built as a Progressive Web App (PWA) for a native-like, installable experience on any device.

### 2. Technical Architecture

The application is built on a modern, serverless, and AI-integrated technology stack designed for scalability, performance, and a rich user experience.

*   **Frontend Framework:** **Next.js (with App Router)** is used for its hybrid rendering capabilities. This allows for a mix of static pages (for marketing), Server-Side Rendered (SSR) pages for dynamic content that needs to be fresh (like search results), and Client-Side Rendered (CSR) interactivity for a fluid user experience in dashboards and forms. The App Router enables better code organization and performance optimizations like Server Components.
*   **Backend & Database:** **Firebase** serves as the backend-as-a-service (BaaS).
    *   **Firestore:** A NoSQL, document-based database used to store all application data, including user profiles, vendor listings, bookings, chat conversations, and notifications. Its real-time capabilities are leveraged for the chat and notification systems.
    *   **Firebase Authentication:** Handles all user authentication, supporting both email/password and Google OAuth providers. It securely manages user sessions.
*   **AI Integration:** **Genkit (v1.x)** is the exclusive toolkit for all generative AI functionalities. It acts as an abstraction layer over Google's Gemini models.
    *   **Language Models:** `gemini-2.0-flash` is used for most text-based generation and conversational tasks due to its balance of speed and capability.
    *   **Image Generation:** `gemini-2.0-flash-preview-image-generation` is used for the "Mood Board" feature, allowing users to generate visual inspiration from text prompts.
    *   **Genkit Flows:** All AI logic is encapsulated in server-side "flows" (`src/ai/flows/`). These are strongly-typed, testable functions that handle prompting, tool use, and data structuring, separating AI logic cleanly from the UI.
*   **UI Components & Styling:**
    *   **ShadCN/UI:** A collection of beautifully designed, accessible, and unstyled components that serve as the building blocks for the entire UI.
    *   **Tailwind CSS:** A utility-first CSS framework used for all styling. It allows for rapid development of custom designs while maintaining a consistent design system.
    *   **Recharts:** Used for creating the interactive pie chart on the budget management page.
    *   **Lucide React:** The default icon library, providing a clean and consistent set of icons throughout the application.

### 3. Design System & User Experience

The application follows a modern, clean, and professional design aesthetic, prioritizing clarity and ease of use.

*   **Color Palette:** The theme is defined in `src/app/globals.css` using HSL CSS variables for easy customization.
    *   **Primary:** A vibrant yet soft purple (`hsl(236 71% 72%)`), used for calls-to-action, active states, and key highlights.
    *   **Background:** A light grey/off-white in light mode (`hsl(228 100% 98%)`) and a deep, dark blue-grey in dark mode (`hsl(228 10% 10%)`), ensuring high contrast and readability.
    *   **Accent:** A bright yellow/orange is available for secondary highlights.
*   **Typography:** A combination of two fonts is used to create a clear visual hierarchy.
    *   **Headlines (`--font-playfair-display`):** A classic serif font for titles and major headings, lending an elegant and sophisticated feel.
    *   **Body Text (`--font-pt-sans`):** A clean, readable sans-serif font for all paragraphs, labels, and UI text.
*   **Responsiveness & PWA:** The app is mobile-first and fully responsive. The footer navigation on mobile provides a native app-like experience. The PWA manifest (`public/manifest.webmanifest`) allows users to "install" the app on their devices for offline access and an integrated feel.
*   **State Management:** React Context API is used for managing global state.
    *   `AuthContext`: Manages the current user's authentication state and provides it to the entire app.
    *   `FavoritesContext`: Manages the user's list of favorited vendors, persisting the data in the browser's Local Storage for a seamless experience across sessions.

### 4. Application Flowchart & Screen Descriptions

This outlines the complete user journey through the application.

```mermaid
graph TD
    subgraph Authentication
        A[Start: Welcome Page (`/`)] --> B{User Action};
        B -->|Get Started| C[Login Page (`/login`)];
        B -->|Explore as Guest| D[Home Page (`/home`)];
        C --> E[Signup Page (`/signup`)];
        C --> F[Google Sign-In];
        E --> D;
        F --> D;
        C -- On Success --> D;
    end

    subgraph Core App Experience
        D --> G(Search Bar & Category Carousels);
        G -- Search --> H[Search Results Page (`/search`)];
        G -- Click Venue --> I[Venue Detail Page (`/venues/:slug`)];
        H -- Click Venue --> I;

        I --> J[Request Booking];
        I --> K[Contact Provider];
        I --> L[Add to Favorites];

        J -- Success --> M[Bookings Page (`/bookings`)];
        K -- Success --> N[Chat Page (`/chat`)];
        L -- Success --> O[Favorites Page (`/favorites`)];
    end

    subgraph User & AI Tools
        P[Main Navigation] --> H;
        P --> Q[AI Planner (`/planner`)];
        P --> R[Budget Page (`/budget`)];
        P --> S[Profile & Account (`/profile`)];
        P --> O;
        P --> M;
        P --> N;
        
        Q --> T(Generate Ideas);
        T --> U(Display AI Suggestions);
        U --> V(Generate Mood Board);
        
        R --> W(Add Expenses Manually);
        R --> X(Add Expenses with AI);
    end

    subgraph Vendor Flow
        S --> Y[My Listings Page (`/my-listings`)];
        S --> Z[Add a Listing (`/add-listing`)];
        Z --> AA(Select Category);
        AA --> BB(Fill Dynamic Form);
        BB -- Submit --> Y;
    end
```

---

#### Screen-by-Screen Breakdown:

*   **Welcome Page (`/`)**:
    *   **Content:** The app's logo, a compelling headline ("Plan Your Perfect Event"), a brief description, and two main buttons: "Get Started" and "Explore as Guest".
    *   **Function:** Serves as the entry point for unauthenticated users, directing them toward authentication or exploration.

*   **Login (`/login`) & Signup (`/signup`) Pages**:
    *   **Content:** Clean forms for email/password, a "Continue with Google" option, and links to toggle between the two pages.
    *   **Function:** Handles user authentication via Firebase Auth. On successful login/signup, the user is redirected to the `/home` page.

*   **Home Page (`/home`)**:
    *   **Content:** A large search bar at the top, followed by horizontally scrolling carousels of vendor cards (e.g., "Popular Venues," "Top Photographers").
    *   **Function:** The main dashboard for discovery. Users can initiate a search or browse curated vendor lists.

*   **Search Page (`/search`)**:
    *   **Content:** A sidebar with detailed filters (keyword, location, category, price range, amenities, guest capacity) and a main content area displaying search results as vendor cards.
    *   **Function:** The primary tool for finding specific services. The URL is updated with search parameters, making searches shareable.

*   **Venue Detail Page (`/venues/:slug`)**:
    *   **Content:** A rich, detailed view of a single vendor. Includes a main image and gallery, vendor name, location, rating, reviews, a detailed "About" section, list of amenities, and user reviews. A sticky booking card on the side allows users to select a date and number of guests.
    *   **Function:** Provides all necessary information for a user to make a decision. From here, a user can request to book, contact the provider (initiating a chat), or add the venue to their favorites.

*   **AI Planner Page (`/planner`)**:
    *   **Content:** A two-column layout. On the left, a form for event details (type, guest count, budget, extra info). On the right, an area where AI-generated ideas for a theme, decorations, and activities appear. After ideas are generated, a "Generate Mood Board" button appears.
    *   **Function:** Leverages the `suggestEventIdeas` and `generateMoodBoard` Genkit flows to provide creative inspiration.

*   **Budget Page (`/budget`)**:
    *   **Content:** An overview card with a pie chart visualizing expenses by category, along with total spent and remaining budget. Below, an "AI Expense Assistant" allows natural language input. Finally, a section lists all expenses, which can be edited or deleted manually.
    *   **Function:** A comprehensive tool for financial planning, powered by the `addExpensesToBudget` Genkit flow.

*   **Chat Page (`/chat`)**:
    *   **Content:** A classic two-panel chat interface. A list of conversations (with vendors or the AI assistant) is on the left. The selected conversation's message history is on the right, with a text input at the bottom.
    *   **Function:** Facilitates real-time communication using Firestore's real-time listeners. It also integrates the `chatFlow` for interacting with the AI agent.

*   **Bookings Page (`/bookings`)**:
    *   **Content:** Tabbed interface for "Upcoming" and "Past" bookings. Each booking is a card displaying key details. Past bookings include a "Leave a Review" button.
    *   **Function:** Allows users to track their event commitments and provide feedback on completed services.

*   **Favorites Page (`/favorites`)**:
    *   **Content:** A simple grid of vendor cards for every item the user has "favorited".
    *   **Function:** Provides a personalized shortlist of preferred vendors.

*   **Add Listing Page (`/add-listing`)**:
    *   **Content:** A dynamic form. The user first selects a service category from a dropdown. Based on the selection, the appropriate form fields (defined in `src/components/add-listing/forms/`) are rendered.
    *   **Function:** The main entry point for vendors to join the platform. Uses `react-hook-form` and `zod` for robust, type-safe form validation.

*   **My Listings Page (`/my-listings`)**:
    *   **Content:** A grid displaying all the listings created by the currently logged-in vendor.
    *   **Function:** The vendor's dashboard for managing their presence on the platform.

*   **Profile Page (`/profile`)**:
    *   **Content:** Displays user information (name, email, member since). Below are sections with links to "My Account" (My Listings, Add a Listing) and "Settings" (Edit Profile). Includes a prominent "Log Out" button.
    *   **Function:** The user's central control panel for all account-related activities.