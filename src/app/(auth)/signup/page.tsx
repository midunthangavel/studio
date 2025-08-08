
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Loader, ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AppLogo } from '@/components/shared/app-logo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
        toast({
            variant: 'destructive',
            title: 'Agreement Required',
            description: 'You must agree to the terms and conditions.',
        });
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      router.push('/home');
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please try logging in.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-red-200 via-yellow-200 to-orange-200 p-6">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="bg-background/20 hover:bg-background/40">
            <ArrowLeft />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
         <AppLogo width={192} height={96} />
      </div>

      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-2xl space-y-4">
        <div className='text-left mb-4'>
            <h1 className="text-2xl font-bold font-headline">Create your Account</h1>
            <p className="text-muted-foreground">
                Let's get started with a free account.
            </p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
           <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="name" 
                placeholder="Full Name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="h-14 pl-10"
              />
            </div>
          <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="h-14 pl-10"
                placeholder='Password'
                required
            />
          </div>
            <div className="flex items-start space-x-3 pt-4">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} className="mt-1" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal">
                   By signing up you agree to the <Link href="#" className="font-semibold text-primary">terms of service</Link> and <Link href="#" className="font-semibold text-primary">privacy policy</Link>.
                </Label>
            </div>
             <Button type="submit" disabled={loading} className="w-full h-14 text-base !mt-8">
                {loading ? <Loader className="animate-spin" /> : 'Create Account'}
            </Button>
        </form>
         <p className="text-center text-muted-foreground text-sm mt-6">
                Already have an account?{" "}
                <Link href="/login" className="underline font-semibold text-primary">
                Login
                </Link>
            </p>
      </div>
    </div>
  );
}
