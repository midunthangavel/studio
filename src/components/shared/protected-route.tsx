
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
     return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
}
