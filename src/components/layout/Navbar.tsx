"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { BookOpenText } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState({}, "", "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
          onClick={handleHomeClick}
        >
          <BookOpenText className="h-5 w-5 text-primary" />
          Quick Genie
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
            onClick={handleHomeClick}
          >
            Home
          </Link>
          <Link href="#how" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <div className="ml-4 flex items-center gap-4">
            <ThemeToggle />
            <button className="rounded-full bg-primary px-5 py-2 text-primary-foreground transition-all hover:opacity-90 active:scale-95">
              Get Started
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="text-muted-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground"
              onClick={handleHomeClick}
            >
              Home
            </Link>
            <Link
              href="#how"
              className="hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <button className="mt-2 w-full rounded-lg bg-primary py-3 text-primary-foreground">
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
