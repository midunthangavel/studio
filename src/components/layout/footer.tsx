import Link from "next/link";
import { Mountain, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container max-w-screen-2xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-6 w-6" />
              <span className="font-bold text-xl font-headline">
                VenueVoyager
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your journey to the perfect function starts here. Discover and book
              unique venues and services with ease.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search?category=venues"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=catering"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Caterers
                </Link>
              </li>
              <li>
                <Link
                  href="/search?category=decorators"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Decorators
                </Link>
              </li>
              <li>
                <Link
                  href="/planner"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Inspiration
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  For Service Providers
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our newsletter for the latest deals and inspiration.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VenueVoyager. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
