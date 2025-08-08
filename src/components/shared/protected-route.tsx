
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect if loading is finished and there's no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // If we are loading, show a loading screen.
  if (loading) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  // If we're done loading and there is a user, show the children.
  if (!loading && user) {
    return <>{children}</>;
  }

  // If not loading and no user, we are about to redirect, so we can return null or a loader.
  return (
    <div className="flex items-center justify-center h-screen bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
