
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';
      if (user && isAuthPage) {
        router.replace('/home');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading: loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
