
'use client';

import "./globals.css";
import { Header } from "@/components/layout/header";
import dynamic from 'next/dynamic';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { PT_Sans, Playfair_Display } from 'next/font/google';
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});


const Footer = dynamic(() => import('@/components/layout/footer').then(mod => mod.Footer), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FixmyEvent</title>
        <meta name="description" content="Find and book venues and services for your events." />
      </head>
      <body className={cn("font-body antialiased", ptSans.variable, playfair.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ConditionalLayout>
                {children}
            </ConditionalLayout>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function ConditionalLayout({ children }: {children: React.ReactNode}) {
    const pathname = usePathname();
    const noLayoutRoutes = ['/'];

    if (noLayoutRoutes.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1 container">{children}</main>
          <Footer />
        </div>
    )
}
