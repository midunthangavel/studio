
'use client';

import {
  ChevronRight,
  User,
  Star,
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
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { PageWrapper } from '@/components/page-wrapper';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/protected-route';

const accountSettings = [
  { icon: Star, text: 'VenueVoyager Plus', href: '#' },
  { icon: User, text: 'Edit Profile', href: '/profile/edit' },
  { icon: CreditCard, text: 'Saved Cards & Wallet', href: '#' },
  { icon: MapPin, text: 'Saved Addresses', href: '#' },
  { icon: Languages, text: 'Select Language', href: '#' },
  { icon: Bell, text: 'Notification Settings', href: '/notifications' },
  { icon: Lock, text: 'Privacy Center', href: '#' },
];

const myActivity = [
  { icon: Edit, text: 'Reviews', href: '#' },
  { icon: MessageSquare, text: 'Questions & Answers', href: '#' },
];

const earnWith = [{ icon: Store, text: 'Sell on VenueVoyager', href: '#' }];

const feedbackAndInfo = [
  { icon: FileText, text: 'Terms, Policies and Licenses', href: '#' },
  { icon: HelpCircle, text: 'Browse FAQs', href: '#' },
];

const LanguageSwitcher = () => (
  <div className="p-4 bg-background">
    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
      Try VenueVoyager in your language
    </h3>
    <div className="flex gap-2 overflow-x-auto pb-2">
      {['English', 'Español', 'Français', 'Deutsch', '+8 more'].map(
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
      <div className="flex flex-col">
        {items.map((item, index) => (
          <Link href={item.href} key={item.text}>
            <div className="flex items-center py-4">
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
      <div className="bg-muted/50 pb-20">
        {user && (
          <div className="p-4 bg-background flex items-center justify-between">
            <div>
              <p className="font-semibold">{user.displayName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
        <Separator />

        <LanguageSwitcher />

        <div className="my-2" />
        <Section title="Account Settings" items={accountSettings} />

        <div className="my-2" />
        <Section title="My Activity" items={myActivity} />

        <div className="my-2" />
        <Section title="Earn with VenueVoyager" items={earnWith} />

        <div className="my-2" />
        <Section title="Feedback & Information" items={feedbackAndInfo} />

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
