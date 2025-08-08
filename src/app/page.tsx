
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Chrome, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/shared/app-logo";


export default function WelcomePage() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In logic
    // which would typically involve a popup or redirect.
    // For this mock, we'll just redirect to home.
    router.push('/home');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary/20 via-background to-background p-6">
      <div className="flex-1 flex flex-col justify-center items-center">
        <AppLogo width={160} height={40} className="mb-6" />
        
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3 text-foreground text-center">
          Explore,
          <br />
          Book,
          <br />
          Enjoy
        </h1>
        <p className="max-w-md text-muted-foreground text-sm text-center">
            The best way to find and book venues for your next event.
        </p>
      </div>
      
      <div className="space-y-3 bg-card/50 backdrop-blur-sm p-3 rounded-xl border">
        <Button variant="outline" className="w-full h-10" onClick={handleGoogleSignIn}>
          <Chrome className="mr-2" /> Continue with Google
        </Button>
         <Button className="w-full h-10" asChild>
          <Link href="/signup">
            Create an Account
          </Link>
        </Button>
        <p className="text-center text-muted-foreground text-xs pt-2">
          Already have an account? <Link href="/login" className="font-semibold text-primary">Login</Link>
        </p>
      </div>

    </div>
  );
}
