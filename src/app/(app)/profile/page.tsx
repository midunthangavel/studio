
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
  MessageSquare,
  LogOut,
  Store,
  Wallet,
  Gift,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/shared/protected-route';
import Image from 'next/image';

const accountSettings = [
  { icon: Wallet, text: 'FixmyEvent Wallet', href: '#' },
  { icon: MapPin, text: 'Saved Addresses', href: '#' },
  { icon: CreditCard, text: 'Payment Methods', href: '#' },
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
  <div className="p-4 bg-background">
    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
      Try VenueVoyager in your language
    </h3>
    <div className="flex gap-2 overflow-x-auto pb-2">
      {['English', 'Español', 'Français', 'Deutsch', 'Hindi'].map(
        (lang, index) => (
          <Button
            key={lang}
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
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-col bg-card border rounded-lg">
        {items.map((item, index) => (
          <Link href={item.href} key={item.text}>
           <div className="flex items-center p-4">
              <item.icon className="w-6 h-6 mr-4 text-primary" />
              <span className="flex-grow">{item.text}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="bg-muted/40 pb-20">
        {user ? (
          <div className="relative h-40 bg-primary/20 p-4 flex items-end text-primary-foreground">
            <Image 
                src="https://placehold.co/600x400/7A90E7/FFFFFF"
                alt="Profile background"
                layout='fill'
                objectFit='cover'
                className='opacity-20'
                data-ai-hint="abstract background"
            />
            <div className="relative z-10">
                <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
                <p className="text-sm">{user.email}</p>
                <p className='text-xs mt-1'>Member since Jun 2024</p>
            </div>
          </div>
        ) : (
             <div className="relative h-40 bg-primary/20 p-4 flex items-end text-primary-foreground">
                <Image 
                    src="https://placehold.co/600x400/7A90E7/FFFFFF"
                    alt="Profile background"
                    layout='fill'
                    objectFit='cover'
                    className='opacity-20'
                    data-ai-hint="abstract background"
                />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">Guest User</h2>
                    <p className="text-sm">guest@example.com</p>
                    <p className='text-xs mt-1'>Not logged in</p>
                </div>
            </div>
        )}
        
        <LanguageSwitcher />

        <Section title="My Account" items={accountSettings} />
        <Section title="Settings" items={settingsItems} />
        <Section title="Help & Support" items={helpAndSupport} />

        <div className="p-4 mt-4">
          <Button
            variant="outline"
            className="w-full bg-card"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
