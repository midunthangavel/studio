
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  User,
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
      href: '/profile',
      icon: User,
    },
  ];

  // Hide footer on auth pages that we are no longer using
  if (['/login', '/signup', '/'].includes(pathname)) {
    return null;
  }

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm h-14">
      <div className="relative grid h-full grid-cols-5 items-center justify-around bg-background/70 border backdrop-blur-sm rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors h-full w-full rounded-full',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <div className={cn(
                  'flex flex-col items-center justify-center h-10 w-10 rounded-full transition-colors',
                  isActive ? 'bg-primary/10' : ''
              )}>
                <item.icon className={cn("h-4 w-4")} />
              </div>
              <span className="truncate text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
