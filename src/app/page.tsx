
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AppLogo } from "@/components/layout/app-logo";

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-background">
       <Image
          src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1920&h=1080&fit=crop"
          alt="Elegant event venue"
          fill
          className="z-0 object-cover"
          data-ai-hint="wedding ceremony"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4">
        <AppLogo className="text-8xl mb-6" />
        
        <p className="mt-2 max-w-2xl text-lg md:text-xl text-primary-foreground/80 mb-10">
          Your perfect event, simplified.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg">
          <Link href="/home">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}
