"use client";

import { Sparkles, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Sparkles className="h-5 w-5 text-blue-400" />
          QuickSummary
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-400 md:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Link href="#how" className="transition-colors hover:text-white">
            How it works
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </Link>
          <button className="ml-4 rounded-full bg-blue-600 px-5 py-2 text-white transition-all hover:bg-blue-500 active:scale-95">
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="text-gray-400 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-white/5 bg-[#020617] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-400">
            <Link
              href="/"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#how"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <button className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-white">
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
