"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  Headphones,
  Check,
  MapPin,
} from "lucide-react";
import { cn, formatPriceLKR } from "@/lib/utils";

// Mock product data
const product = {
  id: "1",
  slug: "delight-domestic-ro-plant",
  name: "Delight Domestic RO Water Purifier",
  description: "Advanced 5-stage domestic reverse osmosis water purifier. Removes dissolved solids, heavy metals, bacteria, and viruses. Perfect for household drinking water purification. Includes installation kit and 1-year warranty.",
  specifications: [
    { label: "Stages", value: "5-Stage Filtration" },
    { label: "Capacity", value: "75-150 GPD" },
    { label: "Storage Tank", value: "12 Liters" },
    { label: "Power", value: "24V DC" },
    { label: "Warranty", value: "1 Year" },
    { label: "Installation", value: "Free Islandwide" },
  ],
  images: [
    "https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO+Front",
    "https://placehold.co/600x600/3fc6ff/ffffff?text=Delight+RO+Side",
    "https://placehold.co/600x600/00223d/3fc6ff?text=Delight+RO+Detail",
    "https://placehold.co/600x600/bff1ff/003b6f?text=Delight+RO+Kit",
  ],
  brand: "Delight",
  category: "Domestic RO Plants",
  rating: 4.7,
  reviewCount: 23,
  soldCount: 156,
  stock: 15,
};

const options = {
  capacity: ["75 GPD", "100 GPD", "150 GPD"],
  color: ["White", "Blue", "Silver"],
};

const variantPrices: Record<string, Record<string, number>> = {
  "75 GPD": { White: 32500, Blue: 33500, Silver: 34500 },
  "100 GPD": { White: 36500, Blue: 37500, Silver: 38500 },
  "150 GPD": { White: 42500, Blue: 43500, Silver: 44500 },
};

const colorHex: Record<string, string> = {
  White: "#ffffff",
  Blue: "#3fc6ff",
  Silver: "#c0c0c0",
};

export default function ProductPage() {
  const [selectedCapacity, setSelectedCapacity] = useState(options.capacity[1]);
  const [selectedColor, setSelectedColor] = useState(options.color[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const currentPrice = variantPrices[selectedCapacity][selectedColor];
  const comparePrice = currentPrice + 5000;
  const discount = Math.round(((comparePrice - currentPrice) / comparePrice) * 100);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] mb-4 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-[var(--color-primary)] whitespace-nowrap">Home</Link>
        <ChevronRight size={14} />
        <Link href="/categories/ro-water-purifiers" className="hover:text-[var(--color-primary)] whitespace-nowrap">
          RO Water Purifiers
        </Link>
        <ChevronRight size={14} />
        <Link href="/categories/domestic-ro-plants" className="hover:text-[var(--color-primary)] whitespace-nowrap">
          Domestic RO Plants
        </Link>
        <ChevronRight size={14} />
        <span className="text-[var(--color-foreground)] truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Gallery */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden mb-3">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Discount badge */}
              <div className="absolute top-3 left-3 bg-[var(--color-deal)] text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </div>
              {/* Wishlist */}
              <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Heart size={18} className="text-[var(--color-muted-foreground)]" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all",
                    i === selectedImage
                      ? "border-[var(--color-aqua)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-aqua)]/50"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle - Product Info */}
        <div className="lg:col-span-4">
          {/* Brand & Title */}
          <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{product.brand}</p>
          <h1 className="font-heading text-xl lg:text-2xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {product.reviewCount} Reviews
            </span>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {product.soldCount} Sold
            </span>
          </div>

          {/* Price */}
          <div className="p-4 rounded-xl bg-[var(--color-muted)] mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[var(--color-deal)]">
                {formatPriceLKR(currentPrice)}
              </span>
              <span className="text-lg text-[var(--color-muted-foreground)] line-through">
                {formatPriceLKR(comparePrice)}
              </span>
              <span className="bg-[var(--color-deal)] text-white text-sm font-bold px-2 py-0.5 rounded">
                -{discount}%
              </span>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              Inclusive of all taxes. Free installation included.
            </p>
          </div>

          {/* Variant Pickers */}
          <div className="space-y-4 mb-6">
            {/* Capacity */}
            <div>
              <p className="text-sm font-medium mb-2">
                Capacity: <span className="text-[var(--color-primary)]">{selectedCapacity}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {options.capacity.map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSelectedCapacity(cap)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                      cap === selectedCapacity
                        ? "border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-aqua)]/50"
                    )}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-medium mb-2">
                Color: <span className="text-[var(--color-primary)]">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {options.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all relative",
                      color === selectedColor
                        ? "border-[var(--color-aqua)] scale-110"
                        : "border-[var(--color-border)]"
                    )}
                    style={{ backgroundColor: colorHex[color] }}
                    title={color}
                  >
                    {color === selectedColor && (
                      <Check
                        size={16}
                        className={cn(
                          "absolute inset-0 m-auto",
                          color === "White" ? "text-[var(--color-primary)]" : "text-white"
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-[var(--color-border)] rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-muted)]"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-muted)]"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {product.stock} available
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-xl hover:bg-[var(--color-primary)]/5 transition-colors">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="flex-1 h-12 flex items-center justify-center gap-2 ocean-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
              <Zap size={20} />
              Buy Now
            </button>
          </div>

          {/* Share & Wishlist */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
              <Heart size={18} /> Add to Wishlist
            </button>
            <button className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>

        {/* Right - Delivery & Seller Info */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            {/* Delivery */}
            <div className="p-4 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-heading font-semibold text-sm mb-3">Delivery Options</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Truck size={16} className="text-[var(--color-aqua)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Islandwide Delivery</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Free shipping above Rs 25,000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[var(--color-aqua)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Ships in 1-2 days</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Western Province: 1-2 days | Others: 2-4 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Free Installation</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Professional installation included
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div className="p-4 rounded-xl border border-[var(--color-border)]">
              <h4 className="font-heading font-semibold text-sm mb-3">Sold by</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full ocean-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DW</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Delight Water Solutions</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Official Store</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <div>
                  <p className="font-bold text-[var(--color-primary)]">98%</p>
                  <p className="text-[var(--color-muted-foreground)]">Response Rate</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-primary)]">4.8★</p>
                  <p className="text-[var(--color-muted-foreground)]">Seller Rating</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Shield, text: "1 Year Warranty" },
                { icon: Headphones, text: "24/7 Support" },
                { icon: Truck, text: "Free Delivery*" },
                { icon: Check, text: "Genuine Parts" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 p-2 rounded-lg bg-[var(--color-muted)]">
                  <Icon size={14} className="text-[var(--color-aqua)]" />
                  <span className="text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 border-t border-[var(--color-border)] pt-8">
        <div className="flex gap-1 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar">
          {["description", "specifications", "reviews", "shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab
                  ? "border-[var(--color-aqua)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose prose-sm max-w-none">
              <p className="text-[var(--color-foreground)] leading-relaxed">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {[
                  "5-stage RO filtration system removes up to 99% of dissolved solids",
                  "UV sterilization for complete bacteria and virus elimination",
                  "Automatic flush system extends membrane life",
                  "Smart TDS controller maintains optimal mineral content",
                  "Food-grade materials safe for drinking water",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "specifications" && (
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((spec, i) => (
                  <tr key={spec.label} className={cn(i % 2 === 0 && "bg-[var(--color-muted)]")}>
                    <td className="px-4 py-3 font-medium w-1/3">{spec.label}</td>
                    <td className="px-4 py-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-12">
              <Star size={40} className="mx-auto text-[var(--color-muted-foreground)]/30 mb-4" />
              <p className="text-[var(--color-muted-foreground)]">No reviews yet. Be the first to review!</p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Shipping Information</h4>
                <ul className="space-y-1 text-[var(--color-muted-foreground)]">
                  <li>• Free shipping on orders above Rs 25,000</li>
                  <li>• Western Province: 1-2 business days</li>
                  <li>• Other provinces: 2-4 business days</li>
                  <li>• Self-pickup available at Galewela warehouse</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Returns & Refunds</h4>
                <ul className="space-y-1 text-[var(--color-muted-foreground)]">
                  <li>• 7-day return policy for defective products</li>
                  <li>• 1-year warranty on all RO systems</li>
                  <li>• Free replacement for manufacturing defects</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[var(--color-border)] p-3 flex items-center gap-3 z-40">
        <div>
          <p className="text-lg font-bold text-[var(--color-deal)]">{formatPriceLKR(currentPrice)}</p>
        </div>
        <div className="flex-1 flex gap-2">
          <button className="flex-1 h-11 flex items-center justify-center gap-1 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-xl text-sm">
            <ShoppingCart size={16} />
            Add
          </button>
          <button className="flex-1 h-11 flex items-center justify-center gap-1 ocean-gradient text-white font-semibold rounded-xl text-sm">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
