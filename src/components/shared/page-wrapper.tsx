
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
        <div className={cn("container mx-auto px-4 py-8 sm:py-12", className)}>
            <div className="text-center mb-10 sm:mb-12">
                <div className="mx-auto w-fit bg-primary/10 p-3 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">
                    {title}
                </h1>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                    {description}
                </p>
            </div>
            {children}
        </div>
    )
}
