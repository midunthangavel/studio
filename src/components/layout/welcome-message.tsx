
'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

export function WelcomeMessage() {
    const [location, setLocation] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
      async function fetchLocation() {
        try {
          const response = await fetch('https://ip-api.com/json/?fields=city,country');
          if (!response.ok) {
            // Instead of throwing an error, we'll set the locationError state.
            setLocationError('Could not fetch location details.');
            console.error('Failed to fetch location:', response.statusText);
            return;
          }
          const data = await response.json();
          if (data.city && data.country) {
            setLocation(`${data.city}, ${data.country}`);
          } else {
            setLocationError("Could not determine your location.");
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
          setLocationError("Could not fetch location details.");
        }
      }

      fetchLocation();
    }, []);
    
    return (
        <div className="bg-card border rounded-lg p-3 text-sm mb-3 shadow-sm flex items-center gap-3">
            <Avatar>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold text-base">Welcome back!</h2>
                <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{location || locationError || 'Finding your location...'}</span>
                </div>
            </div>
        </div>
    )
}
