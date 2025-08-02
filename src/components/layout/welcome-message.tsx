
'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function WelcomeMessage() {
    return (
        <div className="bg-card border rounded-lg p-3 text-sm mb-3 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold text-base">Welcome back!</h2>
                    <div className="flex items-center text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span>Find the perfect venue for your next event.</span>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </div>
    )
}
