import Link from "next/link";
import { Droplets, Phone, Mail, MapPin, Globe, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="water-gradient text-white mt-auto">
      {/* Wave Divider SVG */}
      <div className="relative h-16 overflow-hidden -mb-1">
        <svg
          className="absolute bottom-0 w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
            fill="var(--color-abyss)"
          />
        </svg>
      </div>

      <div className="bg-[var(--color-abyss)]">
        <div className="max-w-[1440px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full ocean-gradient flex items-center justify-center">
                  <Droplets size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold leading-none">
                    Delight
                  </h3>
                  <p className="text-xs text-[var(--color-aqua)]">Water Solutions</p>
                </div>
              </Link>
              <p className="text-sm text-white/70 leading-relaxed">
                Sri Lanka&apos;s trusted provider of water purification systems,
                RO plants, and water treatment solutions since 2015.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-aqua)]/30 transition-colors"
                >
                  <Globe size={16} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-aqua)]/30 transition-colors"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4 text-[var(--color-aqua)]">
                Shop
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/categories/ro-water-purifiers" className="text-white/70 hover:text-white transition-colors">
                    RO Water Purifiers
                  </Link>
                </li>
                <li>
                  <Link href="/categories/water-filters" className="text-white/70 hover:text-white transition-colors">
                    Water Filters
                  </Link>
                </li>
                <li>
                  <Link href="/categories/spare-parts" className="text-white/70 hover:text-white transition-colors">
                    Spare Parts
                  </Link>
                </li>
                <li>
                  <Link href="/categories/chemicals-consumables" className="text-white/70 hover:text-white transition-colors">
                    Chemicals & Consumables
                  </Link>
                </li>
                <li>
                  <Link href="/categories/accessories" className="text-white/70 hover:text-white transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-heading font-semibold mb-4 text-[var(--color-aqua)]">
                Customer Service
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/account" className="text-white/70 hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders" className="text-white/70 hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold mb-4 text-[var(--color-aqua)]">
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-white/70">
                  <Phone size={14} className="text-[var(--color-aqua)]" />
                  <span>+94 11 234 5678</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <Mail size={14} className="text-[var(--color-aqua)]" />
                  <span>info@delightwatersolutions.com</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <MapPin size={14} className="text-[var(--color-aqua)] mt-0.5" />
                  <span>Galewela, Sri Lanka</span>
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/50">Business Hours</p>
                <p className="text-sm text-white/80">Mon - Sat: 8:00 AM - 6:00 PM</p>
                <p className="text-sm text-white/80">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <p>© 2024 Delight Water Solutions (Pvt) Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
