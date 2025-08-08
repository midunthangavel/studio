
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Loader, ArrowLeft, Chrome, Mail, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { AppLogo } from '@/components/shared/app-logo';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In logic
    // which would typically involve a popup or redirect.
    // For this mock, we'll just redirect to home.
    router.push('/home');
  };
  
  return (
    <>
      <div className="flex flex-col h-screen bg-background p-4">
          <div className="absolute top-4 left-4 z-10">
              <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="bg-muted hover:bg-muted/80">
                  <ArrowLeft />
              </Button>
          </div>
          
        <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div 
                  className="mb-6"
              >
                <AppLogo width={120} height={60} />
              </div>
              <h1 className="text-2xl font-bold font-headline mb-2 text-foreground">Welcome Back</h1>
              <p className="text-foreground/80 mb-6 max-w-xs text-sm">Enter your credentials to access your account.</p>
        </div>
        
        <div className="bg-card border p-4 rounded-xl space-y-4 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-9" />
            </div>
             <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-9" placeholder="Password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12">
              {loading ? <Loader className="animate-spin" /> : 'Sign in'}
            </Button>
          </form>
            <div className="flex items-center space-x-2">
                <Separator className="flex-grow" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-grow" />
            </div>

            <div className="space-y-3">
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-12" disabled={loading}>
                  <Chrome className="mr-2" /> Continue with Google
              </Button>
            </div>
            <p className="text-center text-muted-foreground text-sm pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline font-semibold text-primary">
                Sign up
              </Link>
            </p>
        </div>
      </div>
    </>
  );
}
