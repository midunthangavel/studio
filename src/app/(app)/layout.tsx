
'use client';

import "../globals.css";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <div className="relative flex min-h-screen flex-col bg-background max-w-7xl mx-auto w-full">
          <Header />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </>
  );
}
