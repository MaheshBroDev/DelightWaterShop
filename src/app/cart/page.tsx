"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck } from "lucide-react";
import { formatPriceLKR } from "@/lib/utils";

// Mock cart data
const mockCartItems = [
  {
    id: "1",
    productId: "1",
    slug: "delight-domestic-ro-plant",
    name: "Delight Domestic RO Water Purifier",
    variant: { capacity: "100 GPD", color: "White" },
    price: 36500,
    quantity: 1,
    image: "https://placehold.co/200x200/003b6f/ffffff?text=RO+Unit",
    stock: 15,
  },
  {
    id: "2",
    productId: "5",
    slug: "pp-spun-filter-10-inch",
    name: "PP Spun Filter 10 Inch - 5 Micron",
    variant: null,
    price: 850,
    quantity: 4,
    image: "https://placehold.co/200x200/e2e8f0/003b6f?text=PP+Filter",
    stock: 50,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(mockCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 25000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = subtotal >= freeShippingThreshold ? 0 : 500;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(itemId);
      return;
    }
    setItems(items.map((item) => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="p-2 rounded-full hover:bg-[var(--color-muted)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-heading text-2xl font-bold">Shopping Cart</h1>
        <span className="text-[var(--color-muted-foreground)]">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 rounded-full bg-[var(--color-muted)] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-[var(--color-muted-foreground)]" />
          </div>
          <h2 className="font-heading text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            Start shopping to add items to your cart
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 ocean-gradient text-white font-semibold rounded-full"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping progress */}
            {freeShippingRemaining > 0 ? (
              <div className="p-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={18} className="text-[var(--color-primary)]" />
                  <p className="text-sm font-medium">
                    Add {formatPriceLKR(freeShippingRemaining)} more for FREE delivery!
                  </p>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-aqua)] rounded-full transition-all"
                    style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
                <Truck size={18} className="text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  You qualify for FREE delivery! 🎉
                </p>
              </div>
            )}

            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-white"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="shrink-0 w-24 h-24 rounded-lg bg-[var(--color-surface)] overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-2"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
                      {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(" | ")}
                    </p>
                  )}
                  <p className="text-lg font-bold text-[var(--color-deal)] mt-2">
                    {formatPriceLKR(item.price)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-[var(--color-muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-muted)]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-muted)]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-foreground)]">
                    {formatPriceLKR(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (couponCode.toUpperCase() === "WELCOME10") {
                    setCouponApplied(true);
                  }
                }}
                className="px-6 h-11 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:opacity-90"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-sm text-green-600 font-medium">✓ Coupon WELCOME10 applied - 10% off!</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-6 rounded-xl border border-[var(--color-border)] bg-white">
              <h3 className="font-heading text-lg font-bold mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted-foreground)]">Subtotal</span>
                  <span className="font-medium">{formatPriceLKR(subtotal)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPriceLKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted-foreground)]">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPriceLKR(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                  <span className="font-heading font-bold text-base">Total</span>
                  <span className="font-heading font-bold text-xl text-[var(--color-deal)]">
                    {formatPriceLKR(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full h-12 flex items-center justify-center ocean-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-[var(--color-muted-foreground)] text-center">
                  Secure payment powered by PayHere
                </p>
                <div className="flex justify-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                  <span>🔒 SSL Secure</span>
                  <span>•</span>
                  <span>Islandwide Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
