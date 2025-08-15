'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/shared/app-logo';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="mb-8">
          <AppLogo width={160} height={40} />
        </div>
        <h1 className="text-4xl font-bold font-headline mb-4 text-foreground">
          Plan Your Perfect Event
        </h1>
        <p className="text-foreground/80 mb-8 max-w-md text-lg">
          Discover and book unique venues, trusted vendors, and everything you need to bring your vision to life.
        </p>
        <div className="flex gap-4">
          <Button size="lg" onClick={() => router.push('/login')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/home')}>
            Explore as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}
