
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Sparkles,
  ConciergeBell,
} from "lucide-react";
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

export function HeaderNavigation() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
      return (
         <nav className="flex justify-center items-center gap-10 text-sm h-12" />
      )
    }

    return (
        <nav className="flex justify-center items-center gap-10 text-sm">
            {categories.map((category) => {
                const isActive = pathname === category.href;
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
                        {category.isNew && (
                            <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                        )}
                    </span>
                    {isActive && (
                    <div className="absolute -bottom-2 h-[2px] w-6 bg-foreground rounded-full" />
                    )}
                </Link>
                )
            })}
        </nav>
    )
}
