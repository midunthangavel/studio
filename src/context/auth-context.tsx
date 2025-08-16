
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import type { UserProfile as AppUserProfile } from '@/types/user';

interface AuthContextType {
  user: User | null;
  profile: AppUserProfile | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as AppUserProfile);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          // Could create a default profile here
          console.warn("User profile not found in Firestore.");
          setProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    }
  }, [user]);


  const signOut = () => {
    firebaseSignOut(auth);
  };

  const value = useMemo(() => ({ user, profile, loading, signOut }), [user, profile, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
