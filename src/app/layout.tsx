
'use client';

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

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
