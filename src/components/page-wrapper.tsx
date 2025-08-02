
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
        <div className={cn("container mx-auto px-4 py-12", className)}>
            <div className="text-center mb-12">
                <Icon className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline">
                    {title}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    {description}
                </p>
            </div>
            {children}
        </div>
    )
}
