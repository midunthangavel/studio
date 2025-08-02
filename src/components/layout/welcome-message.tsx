
'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

export function WelcomeMessage() {
    const [location, setLocation] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
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
        <div className="bg-card border rounded-lg p-3 text-sm mb-3 shadow-sm flex items-center gap-3">
            <Avatar>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold text-base">Welcome back!</h2>
                <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{location || locationError || 'Attempting to get your location...'}</span>
                </div>
            </div>
        </div>
    )
}
