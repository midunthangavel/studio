
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
    <div className="flex flex-col h-screen bg-background p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div 
            className="w-48 h-24 mb-8 flex items-center justify-center" 
            data-ai-hint="logo placeholder"
        >
          <AppLogo width={192} height={96} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Explore,
          <br />
          Book,
          <br />
          Enjoy
        </h1>
        
      </div>
      
      <div className="space-y-4">
        <Button variant="outline" className="w-full h-14 text-base" onClick={handleGoogleSignIn}>
          <Chrome className="mr-2" /> Continue with Google
        </Button>
         <Button className="w-full h-14 text-base" asChild>
          <Link href="/signup">
            Sign up
          </Link>
        </Button>
        <p className="text-center text-muted-foreground text-sm pt-2">
          Already have an account? <Link href="/login" className="font-semibold text-primary">Login</Link>
        </p>
      </div>

    </div>
  );
}
