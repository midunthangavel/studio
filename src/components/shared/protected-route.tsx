
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This logic is commented out to allow for development without authentication.
    // if (!loading && !user) {
    //   router.push('/login');
    // }
  }, [user, loading, router]);

  // If we are loading, show a loading screen.
  if (loading) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  // For development, always show the children.
  return <>{children}</>;
}
