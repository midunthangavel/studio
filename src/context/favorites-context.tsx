
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { VenueCardProps } from '@/components/venue-card';

interface FavoritesContextType {
  favorites: VenueCardProps[];
  toggleFavorite: (venue: VenueCardProps) => void;
  isFavorited: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<VenueCardProps[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Derive a key for local storage. Use a default if user is not logged in (for dev).
  const storageKey = user ? `favorites_${user.uid}` : 'favorites_dev';


  // Load favorites from local storage on initial render
  useEffect(() => {
    try {
        const storedFavorites = localStorage.getItem(storageKey);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    } catch (error) {
        console.error("Failed to parse favorites from local storage", error);
        setFavorites([]);
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem(storageKey, JSON.stringify(favorites));
    }
  }, [favorites, storageKey, isLoaded]);

  const toggleFavorite = (venue: VenueCardProps) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorited = prevFavorites.some(fav => fav.slug === venue.slug);
      if (isAlreadyFavorited) {
        return prevFavorites.filter(fav => fav.slug !== venue.slug);
      } else {
        return [...prevFavorites, venue];
      }
    });
  };

  const isFavorited = (slug: string) => {
    return favorites.some(fav => fav.slug === slug);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
