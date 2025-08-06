
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { Loader, ArrowLeft, User, Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async () => {
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
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-bold font-headline mb-2">First, tell us about you</h1>
        <p className="text-muted-foreground mb-8">
            Create an account to get all features
        </p>
        
        <div className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="h-12"
              />
            </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="h-12"
                placeholder='Enter a password'
            />
          </div>
        </div>
      </div>

       <div className="pt-8">
            <div className="flex items-start space-x-3 mb-6">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} className="mt-1" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal">
                   By signing up you agree to the <Link href="#" className="font-semibold text-primary">terms of service</Link> and <Link href="#" className="font-semibold text-primary">privacy policy</Link>.
                </Label>
            </div>

            <Button onClick={handleSignUp} disabled={loading} className="w-full h-14 text-base">
                {loading ? <Loader className="animate-spin" /> : 'Sign Up'}
            </Button>
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
