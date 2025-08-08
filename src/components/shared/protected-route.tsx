
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   // We only want to redirect if loading is finished and there's no user.
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, loading, router]);

  // // If we are loading, or if there is no user, show a loading screen.
  // // The useEffect above will handle the redirect if there's no user after loading.
  // if (loading || !user) {
  //    return (
  //       <div className="flex items-center justify-center h-screen bg-background">
  //           <Loader className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //   )
  // }
  
  // If loading is finished and there is a user, show the children.
  return <>{children}</>;
}
