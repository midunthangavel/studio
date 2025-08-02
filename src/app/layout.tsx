
'use client';

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VenueVoyager</title>
        <meta name="description" content="Find and book venues and services for your events." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ConditionalLayout>
            {children}
        </ConditionalLayout>
        <Toaster />
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
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
    )
}
