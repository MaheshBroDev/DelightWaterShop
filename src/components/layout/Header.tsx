"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Droplets,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "RO Water Purifiers", href: "/categories/ro-water-purifiers" },
  { name: "Water Filters", href: "/categories/water-filters" },
  { name: "Spare Parts", href: "/categories/spare-parts" },
  { name: "Chemicals", href: "/categories/chemicals-consumables" },
  { name: "Accessories", href: "/categories/accessories" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility Bar */}
      <div className="bg-[var(--color-abyss)] text-white text-xs">
        <div className="max-w-[1440px] mx-auto px-4 h-8 flex items-center justify-between">
          <p className="hidden sm:block">
            Free delivery on orders over Rs 25,000 | 24/7 support | Islandwide shipping
          </p>
          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:text-[var(--color-aqua)] transition-colors">
              My Account
            </Link>
            <Link href="/account/orders" className="hover:text-[var(--color-aqua)] transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full ocean-gradient flex items-center justify-center">
              <Droplets size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg font-bold text-[var(--color-primary)] leading-none">
                Delight
              </h1>
              <p className="text-[10px] text-[var(--color-muted-foreground)] leading-none">
                Water Shop
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div
              className={cn(
                "relative flex items-center rounded-full border transition-all duration-200",
                searchFocused
                  ? "border-[var(--color-aqua)] ring-2 ring-[var(--color-aqua)]/20"
                  : "border-[var(--color-border)]"
              )}
            >
              <Search
                size={18}
                className="absolute left-3 text-[var(--color-muted-foreground)]"
              />
              <input
                type="text"
                placeholder="Search for RO systems, filters, parts..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-transparent text-sm focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-full hover:bg-[var(--color-muted)] transition-colors text-sm"
            >
              <User size={20} />
              <span className="hidden lg:inline">Account</span>
            </Link>
            <Link
              href="/account/wishlist"
              className="relative p-2 rounded-full hover:bg-[var(--color-muted)] transition-colors"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-[var(--color-muted)] transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-deal)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Rail */}
      <nav className="bg-white border-b border-[var(--color-border)] hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-4">
          <ul className="flex items-center gap-1 h-11 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-muted)] rounded-full transition-colors whitespace-nowrap"
                >
                  {cat.name}
                  <ChevronDown size={14} className="opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[104px] z-40 bg-white overflow-y-auto">
          <nav className="p-4">
            <h3 className="font-heading font-semibold mb-3 text-[var(--color-muted-foreground)]">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="block px-4 py-3 rounded-xl hover:bg-[var(--color-muted)] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/auth/sign-in"
                className="block px-4 py-3 rounded-xl hover:bg-[var(--color-muted)] transition-colors font-medium"
              >
                Sign In / Sign Up
              </Link>
              <Link
                href="/account"
                className="block px-4 py-3 rounded-xl hover:bg-[var(--color-muted)] transition-colors font-medium"
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="block px-4 py-3 rounded-xl hover:bg-[var(--color-muted)] transition-colors font-medium"
              >
                Track Order
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
