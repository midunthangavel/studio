
'use client';

import {
  ChevronRight,
  User,
  CreditCard,
  MapPin,
  Languages,
  Bell,
  Lock,
  Edit,
  HelpCircle,
  FileText,
  LogOut,
  Store,
  Wallet,
  Gift,
  ShieldCheck,
  Globe,
  List,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const accountSettings = [
  { icon: Wallet, text: 'FixmyEvent Wallet', href: '#' },
  { icon: List, text: 'My Listings', href: '/my-listings' },
  { icon: Store, text: 'Add a Listing', href: '/add-listing' },
  { icon: Gift, text: 'My Rewards', href: '#' },
];

const settingsItems = [
  { icon: Edit, text: 'Edit Profile', href: '/profile/edit' },
  { icon: ShieldCheck, text: 'Security', href: '#' },
  { icon: Bell, text: 'Notification Settings', href: '/notifications' },
  { icon: Globe, text: 'Select Country', href: '#' },
  { icon: Languages, text: 'Select Language', href: '#' },
];

const helpAndSupport = [
    { icon: HelpCircle, text: 'Help & Support', href: '#' },
    { icon: FileText, text: 'Terms & Conditions', href: '#' },
]


const LanguageSwitcher = () => (
  <div className="p-3 bg-background">
    <h3 className="text-xs font-semibold mb-2 text-muted-foreground">
      Try FixmyEvent in your language
    </h3>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {['English', 'Español', 'Français', 'Deutsch', 'Hindi'].map(
        (lang, index) => (
          <Button
            key={lang}
            size="sm"
            variant={index === 0 ? 'default' : 'outline'}
            className="rounded-full"
          >
            {lang}
          </Button>
        )
      )}
    </div>
  </div>
);

const Section = ({
  title,
  items,
}: {
  title: string;
  items: { icon: React.ElementType; text: string; href: string }[];
}) => (
  <div className="bg-background">
    <div className="p-3">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <div className="flex flex-col bg-card border rounded-lg">
        {items.map((item, index) => (
          <Link href={item.href} key={item.text}>
           <div className="flex items-center p-3">
              <item.icon className="w-5 h-5 mr-3 text-primary" />
              <span className="flex-grow text-sm">{item.text}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            {index < items.length - 1 && <Separator />}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="bg-muted/40 pb-20">
      {user ? (
        <div className="relative h-32 text-white">
          <Image 
              src="https://placehold.co/600x400.png"
              alt="Profile background"
              layout='fill'
              objectFit='cover'
              data-ai-hint="mountain landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-end p-4">
              <h2 className="text-xl font-bold">{user.displayName || 'User'}</h2>
              <p className="text-sm">{user.email}</p>
              <p className='text-xs mt-1'>Member since Jun 2024</p>
          </div>
        </div>
      ) : (
           <div className="relative h-32 text-white">
              <Image 
                  src="https://placehold.co/600x400.png"
                  alt="Profile background"
                  layout='fill'
                  objectFit='cover'
                  data-ai-hint="mountain landscape"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <h2 className="text-xl font-bold">Guest User</h2>
                  <p className="text-sm">guest@example.com</p>
                  <p className='text-xs mt-1'>Not logged in</p>
              </div>
          </div>
      )}
      
      <LanguageSwitcher />

      <Section title="My Account" items={accountSettings} />
      <Section title="Settings" items={settingsItems} />
      <Section title="Help & Support" items={helpAndSupport} />

      <div className="p-3 mt-2">
        <Button
          variant="outline"
          className="w-full bg-card"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
