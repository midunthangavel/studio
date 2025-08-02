
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Home,
  MessageSquare,
  Search,
  User,
  Wallet,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  const noLayoutRoutes = ['/'];

  const navItems = [
    {
      name: 'Explore',
      href: '/search',
      icon: Search,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
    },
    {
      name: 'Bookings',
      href: '/bookings',
      icon: Home,
    },
    {
      name: 'Messages',
      href: '/chat',
      icon: MessageSquare,
    },
    {
      name: 'Budget',
      href: '/budget',
      icon: Wallet,
    },
     {
      name: user ? 'Account' : 'Log in',
      href: '/profile',
      icon: user ? User : LogIn,
    },
  ];

  if (noLayoutRoutes.includes(pathname)) {
    return null;
  }

  // Hide on certain pages
  const hideFooterRoutes = ['/login', '/signup'];
  if (hideFooterRoutes.includes(pathname)) {
      return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container grid h-full max-w-lg grid-cols-6 items-center justify-around">
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
