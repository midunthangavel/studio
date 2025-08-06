
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Chrome, Loader } from "lucide-react";
import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function WelcomePage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push('/home');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Google Sign-in Failed',
            description: error.message,
        });
    } finally {
        setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div 
            className="w-24 h-24 bg-muted rounded-full mb-8" 
            data-ai-hint="logo placeholder"
        />
        
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Explore,
          <br />
          Book,
          <br />
          Enjoy
        </h1>
        
      </div>
      
      <div className="space-y-4">
        <Button variant="outline" className="w-full h-14 text-base" onClick={handleGoogleSignIn} disabled={googleLoading}>
          {googleLoading ? <Loader className="animate-spin mr-2" /> : <Chrome className="mr-2" />} Continue with Google
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
