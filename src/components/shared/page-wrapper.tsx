
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageWrapperProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
}

export function PageWrapper({ icon: Icon, title, description, children, className }: PageWrapperProps) {
    return (
        <div className={cn("container mx-auto px-4 py-6 sm:py-8", className)}>
            <div className="text-center mb-6 sm:mb-8">
                <div className="mx-auto w-fit bg-primary/10 p-2.5 rounded-full mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline">
                    {title}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                    {description}
                </p>
            </div>
            {children}
        </div>
    )
}
