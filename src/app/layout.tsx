

'use client';

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/'];

  const showLayout = !noLayoutRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VenueVoyager</title>
        <meta name="description" content="Find and book venues and services for your events." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <FavoritesProvider>
              {showLayout ? (
                <div className="relative flex min-h-screen flex-col bg-background">
                  <Header />
                  <main className="flex-1 container">{children}</main>
                  <Footer />
                </div>
              ) : (
                <main>{children}</main>
              )}
              <Toaster />
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
