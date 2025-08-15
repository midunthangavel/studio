
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

// Create a mock user for development
const createMockUser = () => ({
  uid: 'dev-user-id',
  email: 'dev@example.com',
  displayName: 'Dev User',
  photoURL: 'https://placehold.co/100x100.png',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
});

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use useMemo to ensure the mock user object is stable across renders
  const mockUser = useMemo(() => createMockUser() as User, []);
  
  // For development, we'll just use the mock user and set loading to false.
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);

  const signOut = () => {
    // In a real app, this would be:
    // import { auth } from '@/lib/firebase';
    // import { signOut as firebaseSignOut } from 'firebase/auth';
    // firebaseSignOut(auth).then(() => setUser(null));
    setUser(null); // For development, just clear the user
  };

  const value = useMemo(() => ({ user, loading, signOut }), [user, loading]);

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
