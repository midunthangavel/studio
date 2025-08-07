
'use client';

import "../globals.css";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  return (
      <>
        <div className="relative flex min-h-screen flex-col bg-background">
          <Header />
          <main className={cn("flex-1", !isSearchPage && "pb-24")}>{children}</main>
          <Footer />
        </div>
        <Toaster />
      </>
  );
}
