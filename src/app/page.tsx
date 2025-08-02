
import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-background">
       <Image
          src="https://placehold.co/1920x1080.png"
          alt="Elegant event venue"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="wedding ceremony"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4">
        <Mountain className="h-24 w-24 mb-6 text-primary" />
        <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4">
          VenueVoyager
        </h1>
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
