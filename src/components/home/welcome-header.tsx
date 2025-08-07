
'use client';

import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

export const WelcomeHeader = () => {
    const { user } = useAuth();
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border">
                        <AvatarImage src={user?.photoURL ?? undefined} />
                        <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold text-lg">Welcome, {user?.displayName?.split(' ')[0] || 'User'}!</h2>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>New York, NY (Current)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
