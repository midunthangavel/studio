
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Sparkles,
  Wallet,
  LayoutGrid
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


const categories = [
  {
    name: "Home",
    icon: <Home className="w-6 h-6" />,
    href: "/home",
  },
   {
    name: "Categories",
    icon: <LayoutGrid className="w-6 h-6" />,
    href: "/search",
  },
  {
    name: "AI Planner",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/planner",
  },
  {
    name: "Budget",
    icon: <Wallet className="w-6 h-6" />,
    href: "/budget",
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
                    className={cn(
                      "relative flex flex-col items-center gap-1 transition-colors hover:text-foreground/80",
                       isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {category.icon}
                    <span className="text-xs font-medium flex items-center gap-1">
                        {category.name}
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
