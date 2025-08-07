
# FixmyEvent Application Flowchart

This document outlines the user flow and architecture of the FixmyEvent application.

```mermaid
graph TD
    A[Start: User opens app] --> B{Is user authenticated?};

    B -- No --> C[Welcome Page (`/`)];
    B -- Yes --> G[Home Page (`/home`)];

    C --> D[Login Page (`/login`)];
    C --> E[Signup Page (`/signup`)];
    C --> F[Continue with Google];

    D -- On Success --> G;
    D -- Go to signup --> E;
    E -- On Success --> G;
    E -- Go to login --> D;
    F -- On Success --> G;

    G --> H(Search Bar);
    G --> I[Venue Sections];
    G --> J(Main Navigation);

    J --> G;
    J --> K[Search Page (`/search`)];
    J --> L[AI Planner (`/planner`)];
    J --> M[Budget Page (`/budget`)];
    J --> N[Profile & Other Links];

    I -- Click Venue --> O[Venue Detail (`/venues/:slug`)];
    H -- Perform Search --> K;

    K -- Click Venue --> O;
    O --> P[Request Booking];
    O --> Q[Contact Provider];
    O --> R[Add to Favorites];

    P -- Success --> S[Bookings Page (`/bookings`)];
    Q -- Success --> T[Chat Page (`/chat`)];
    R -- Success --> U[Favorites Page (`/favorites`)];

    N --> S;
    N --> T;
    N --> U;
    N --> V[Profile Page (`/profile`)];
    N --> W[Notifications (`/notifications`)];

    subgraph Authentication
        C; D; E; F;
    end

    subgraph Main App
        G; H; I; J; K; L; M; N; O; P; Q; R; S; T; U; V; W;
    end
```

## Flow Description

1.  **Start & Authentication**:
    *   When a user opens the app, the system checks if they are logged in.
    *   Authenticated users are directed to the **Home Page**.
    *   Unauthenticated users are sent to the **Welcome Page**.

2.  **Auth Flow**:
    *   From the **Welcome Page**, the user can navigate to **Login**, **Signup**, or sign in with Google.
    *   Successful authentication from any of these paths redirects the user to the **Home Page**.

3.  **Home Page**:
    *   The central hub of the application.
    *   Users can start a search, browse curated venue lists, or use the main navigation to access other features.

4.  **Core Features**:
    *   **Search**: Users can find venues and services, leading to the **Search Page** with results.
    *   **Venue Detail**: Clicking on any venue card leads to its detailed page, where users can book, contact the provider, or save it to their favorites.
    *   **AI Planner**: An assistant to help users brainstorm event ideas.
    *   **Budget**: A tool to manage event expenses.

5.  **User Account**:
    *   Authenticated users have access to personal pages accessible from the main navigation:
        *   **Bookings Page**: View and manage past and upcoming bookings.
        *   **Chat Page**: Communicate with service providers.
        *   **Favorites Page**: See all saved venues and services.
        *   **Profile Page**: Manage account settings.
        *   **Notifications Page**: View recent activity.
