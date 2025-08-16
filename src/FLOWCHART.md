# FixmyEvent Application Flowchart

This document outlines the user flow and architecture of the FixmyEvent application.

```mermaid
graph TD
    subgraph Authentication
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
    end

    subgraph "Core User Flow"
        G --> H(Search Bar & Category Carousels);
        J[Main Navigation] --> K[Search Page (`/search`)];
        J --> L[AI Planner (`/planner`)];
        J --> M[Budget Page (`/budget`)];
        J --> N[Profile & Account (`/profile`)];
        
        H -- Search --> K;
        H -- Click Venue --> O[Venue Detail (`/venues/:slug`)];
        K -- Click Venue --> O;

        O --> P[Request Booking];
        O --> Q[Contact Provider];
        O --> R[Add to Favorites];

        P -- Success --> S[Bookings Page (`/bookings`)];
        Q -- Success --> T[Chat Page (`/chat`)];
        R -- Success --> U[Favorites Page (`/favorites`)];
    end

    subgraph "Vendor Flow"
        N --> N_User(User Profile);
        N_User --> N_BecomeVendor{Become a Vendor?};
        N_BecomeVendor -- Yes --> N_Vendor(Vendor Profile);
        N_Vendor --> V[Vendor Dashboard (`/dashboard`)];
        N_Vendor --> W[Add a Listing (`/add-listing`)];
        V --> W;
    end

    subgraph "User Account Pages"
        J --> S;
        J --> T;
        J --> U;
    end

```

## Flow Description

1.  **Start & Authentication**:
    *   Unauthenticated users start at the **Welcome Page** and can proceed to **Login** or **Signup**.
    *   Authenticated users are directed to the **Home Page**.

2.  **Home Page & Discovery**:
    *   The central hub for discovery. Users can search for services or browse categories.
    *   This leads to the **Search Page** or directly to a **Venue Detail** page.

3.  **Core Features**:
    *   **Venue Detail**: From here, users can **Request Booking**, **Contact Provider** (initiating a chat), or add to **Favorites**.
    *   **AI Planner & Budget**: Tools to assist with event planning and financial management.

4.  **Vendor Experience**:
    *   A regular user can navigate to their **Profile Page**.
    *   On the profile, they have an option to **Become a Vendor**.
    *   Once they become a vendor, their profile page will display links to the **Vendor Dashboard** and **Add a Listing** page.
    *   The **Vendor Dashboard** is the central hub for vendors to manage their listings and incoming bookings.

5.  **User Account**:
    *   Authenticated users have access to personal pages like **Bookings**, **Chat**, and **Favorites**, accessible from the main navigation.
```