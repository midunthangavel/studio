
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Home,
  Sparkles,
  ConciergeBell,
  MapPin,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";

const categories = [
  {
    name: "Homes",
    icon: <Home className="w-6 h-6" />,
    href: "/home",
  },
   {
    name: "Search",
    icon: <Search className="w-6 h-6" />,
    href: "/search",
  },
  {
    name: "Experiences",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/planner",
    isNew: true,
  },
  {
    name: "Services",
    icon: <ConciergeBell className="w-6 h-6" />,
    href: "/search?category=services",
    isNew: true
  },
];

export function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            if (data.city && data.countryName) {
              setLocation(`${data.city}, ${data.countryName}`);
            } else {
              setLocationError("Could not determine your location.");
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
            setLocationError("Could not fetch location details.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Location access was denied.");
          } else {
            setLocationError("Could not access your location.");
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-auto flex-col justify-center gap-4 py-4 max-w-screen-2xl">
        {/* Top: Search Bar */}
        <div className="flex items-center gap-4">
           <Link href="/home" className="font-bold text-lg text-primary font-headline hidden md:block">
            VenueVoyager
          </Link>
          <div className="flex-grow">
            <div className="bg-card border rounded-lg p-3 text-sm mb-3 shadow-sm">
                <h2 className="font-semibold text-base">Welcome back!</h2>
                <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{location || locationError || 'Attempting to get your location...'}</span>
                </div>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Start your search"
                className="w-full rounded-full bg-muted pl-10 h-12 shadow-md focus-visible:ring-primary"
                />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/planner">Become a host</Link>
            </Button>
            <ThemeToggle />
            <Button size="icon" variant="ghost">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
        {/* Bottom: Navigation */}
        <nav className="flex justify-center items-center gap-10 text-sm">
          {categories.map((category) => {
            const isActive = isClient && pathname === category.href;
            return (
                <Link
                href={category.href}
                key={category.name}
                className={`relative flex flex-col items-center gap-1 transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {category.icon}
                <span className="text-xs font-medium flex items-center gap-1">
                    {category.name}
                    {isClient && category.isNew && (
                        <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                </span>
                {isClient && isActive && (
                  <div className="absolute -bottom-2 h-[2px] w-6 bg-foreground rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  );
}
