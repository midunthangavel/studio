import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Camera,
  Car,
  Church,
  Lightbulb,
  MapPin,
  PartyPopper,
  Search,
  Star,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Venues",
    icon: <Church className="w-8 h-8 text-primary" />,
    href: "/search?category=venues",
  },
  {
    name: "Decorators",
    icon: <PartyPopper className="w-8 h-8 text-primary" />,
    href: "/search?category=decorators",
  },
  {
    name: "Catering",
    icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
    href: "/search?category=catering",
  },
  {
    name: "Photography",
    icon: <Camera className="w-8 h-8 text-primary" />,
    href: "/search?category=photography",
  },
  {
    name: "Event Staff",
    icon: <Users className="w-8 h-8 text-primary" />,
    href: "/search?category=staff",
  },
  {
    name: "Transportation",
    icon: <Car className="w-8 h-8 text-primary" />,
    href: "/search?category=transport",
  },
];

const featuredVenues = [
  {
    name: "The Grand Palace",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 120,
    price: "Starts from $5,000",
    image: "https://placehold.co/600x400.png",
    hint: "wedding reception"
  },
  {
    name: "Lakeside Manor",
    location: "Chicago, IL",
    rating: 4.8,
    reviewCount: 85,
    price: "Starts from $3,500",
    image: "https://placehold.co/600x400.png",
    hint: "outdoor wedding"
  },
  {
    name: "The Loft Downtown",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviewCount: 200,
    price: "Starts from $7,000",
    image: "https://placehold.co/600x400.png",
    hint: "modern venue"
  },
  {
    name: "Greenwood Gardens",
    location: "Miami, FL",
    rating: 4.7,
    reviewCount: 95,
    price: "Starts from $4,200",
    image: "https://placehold.co/600x400.png",
    hint: "garden party"
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Elegant event venue"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="wedding ceremony"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            Your Perfect Event, Simplified
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/80">
            Find and book venues, caterers, decorators and more for your wedding, ceremony, or special function.
          </p>
          <div className="mt-8 w-full max-w-3xl bg-background/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Service (e.g., Hall, Catering, Travel Agency)"
                  className="w-full text-foreground"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Location"
                  className="w-full text-foreground"
                />
              </div>
              <div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="categories" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Browse Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link href={category.href} key={category.name}>
                <Card className="text-center p-6 hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center gap-4">
                    {category.icon}
                    <p className="font-semibold text-foreground">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section id="ai-planner" className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold font-headline mb-4">
                Need inspiration? Try our AI Planner
              </h2>
              <p className="text-muted-foreground mb-6">
                Not sure where to start? Let our AI-powered event planner help you brainstorm ideas for your next function. Get suggestions for themes, decorations, activities, and more, all tailored to your needs.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link href="/planner">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image 
                src="https://placehold.co/600x400.png"
                alt="AI Planner"
                width={500}
                height={350}
                className="rounded-lg shadow-xl"
                data-ai-hint="planning event board"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Featured Venues & Services
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/search">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVenues.map((venue) => (
              <Card key={venue.name} className="overflow-hidden group">
                <div className="relative">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={venue.hint}
                  />
                  <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-full">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{venue.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>
                  <div className="flex items-center text-sm mt-2">
                    <div className="flex items-center text-primary font-semibold">
                      <Star className="w-4 h-4 mr-1 fill-primary" />
                      {venue.rating}
                    </div>
                    <span className="text-muted-foreground ml-2">
                      ({venue.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-foreground font-semibold mt-4">
                    {venue.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 font-headline">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Discover</h3>
              <p className="text-muted-foreground max-w-xs">
                Search for venues, halls, caterers, and other services that fit your needs.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">
                <CalendarCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect & Book</h3>
              <p className="text-muted-foreground max-w-xs">
                Contact service providers and book directly through the platform.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Celebrate</h3>
              <p className="text-muted-foreground max-w-xs">
                Enjoy a seamless event with all your bookings managed in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
