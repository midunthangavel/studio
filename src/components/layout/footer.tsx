
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  User,
  LogIn,
  Home,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const navItems = [
    {
      name: 'Home',
      href: '/home',
      icon: Home,
    },
    {
      name: 'Explore',
      href: '/search',
      icon: LayoutGrid,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
    },
    {
      name: 'AI Planner',
      href: '/planner',
      icon: Sparkles,
    },
    {
      name: 'Account',
      href: user ? '/profile' : '/login',
      icon: user ? User : LogIn,
    },
  ];

  // Hide footer on auth pages
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-full max-w-lg grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className={cn("h-5 w-5")} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
