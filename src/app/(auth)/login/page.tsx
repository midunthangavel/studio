
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Loader, ArrowLeft, Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { AppLogo } from '@/components/shared/app-logo';

// A mock icon for Apple
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.012 15.388c-.623 0-1.21-.212-1.8-.626-1.173-.82-1.89-2.22-1.89-3.722 0-2.38 1.545-3.868 3.65-3.868 1.018 0 1.93.483 2.583 1.23l-.014-.012.004.004c.64.735.922 1.543.95 2.375-.028.018-.54.21-1.38.21-.755 0-1.33-.21-2.11-.21-1.12 0-2.25.68-2.25 2.12 0 1.23.86 1.87 1.95 1.87.62 0 1.25-.21 1.88-.65l.02.01c.023-.02.6-.4 1.2-.4.06 0 .1.01.13.01.02 0 .02-.001.03-.001.21.002.4.018.55.053-.05.29-.14.57-.3.84-.52.9-1.3 1.7-2.4 1.7zM14.998 4.5c0-1.24-1.01-2.25-2.26-2.25s-2.25 1.01-2.25 2.25c0 1.24 1.01 2.25 2.25 2.25s2.26-1.01 2.26-2.25z"/>
    </svg>
)

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
    <div className="flex flex-col h-screen bg-background">
        <div className="p-6">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                <ArrowLeft />
            </Button>
        </div>
        
      <div className="flex-1 flex flex-col justify-center p-6">
            <div 
                className="w-40 h-20 mb-6 flex items-center justify-center" 
                data-ai-hint="logo placeholder"
            >
              <AppLogo width={160} height={80} />
            </div>
            <h1 className="text-3xl font-bold font-headline mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Login to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
           <Button type="submit" disabled={loading} className="w-full h-12 text-base">
            {loading ? <Loader className="animate-spin" /> : 'Sign in'}
          </Button>
        </form>
      </div>
      
       <div className="p-6 pt-8">
          <div className="flex items-center space-x-2 my-4">
              <Separator className="flex-grow" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-grow" />
          </div>

          <div className="space-y-3">
             <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-12 text-base" disabled={loading}>
                <Chrome className="mr-2" /> Continue with Google
            </Button>
             <Button variant="outline" className="w-full h-12 text-base" disabled>
                <AppleIcon className="mr-2 w-5 h-5" /> Continue with Apple
            </Button>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="underline font-semibold text-primary">
              Sign up
            </Link>
          </p>
       </div>
    </div>
  );
}
