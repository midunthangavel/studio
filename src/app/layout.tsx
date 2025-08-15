
'use client';

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { PT_Sans, Playfair_Display } from 'next/font/google';
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { InstallPWA } from "@/components/shared/install-pwa";

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#1c1917" />
      </head>
      <body className={cn("font-body antialiased", ptSans.variable, playfairDisplay.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <FavoritesProvider>
              {children}
              <InstallPWA />
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
