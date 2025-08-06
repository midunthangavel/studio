
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Chrome } from "lucide-react";

export default function WelcomePage() {
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
        <Button variant="outline" className="w-full h-14 text-base" asChild>
            <Link href="/login">
                <Chrome className="mr-2" /> Continue with Google
            </Link>
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
