"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Check,
  ChevronRight,
} from "lucide-react";
import { cn, formatPriceLKR, SL_DISTRICTS } from "@/lib/utils";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("payhere_cards");

  const subtotal = 39900;
  const shipping = 0; // Free shipping above 25K
  const discount = 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="p-2 rounded-full hover:bg-[var(--color-muted)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-heading text-2xl font-bold">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                i <= currentStep
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-border)] text-[var(--color-muted-foreground)]"
              )}
            >
              {i < currentStep ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:inline",
                i <= currentStep ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight size={16} className="text-[var(--color-border)] mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-[var(--color-aqua)]" />
                  <h3 className="font-heading font-bold">Shipping Address</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Last Name</label>
                    <input
                      type="text"
                      placeholder="Smith"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 1</label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc."
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">District</label>
                    <select className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none bg-white">
                      <option value="">Select District</option>
                      {SL_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="Colombo"
                      className="w-full h-11 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:ring-2 focus:ring-[var(--color-aqua)]/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={20} className="text-[var(--color-aqua)]" />
                  <h3 className="font-heading font-bold">Shipping Method</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", desc: "2-4 business days", price: "FREE" },
                    { id: "express", label: "Express Delivery", desc: "1-2 business days", price: "Rs 500" },
                    { id: "pickup", label: "Self Pickup - Galewela", desc: "Ready in 24 hours", price: "FREE" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                        shippingMethod === method.id
                          ? "border-[var(--color-aqua)] bg-[var(--color-aqua)]/5"
                          : "border-[var(--color-border)] hover:border-[var(--color-aqua)]/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={() => setShippingMethod(method.id)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        shippingMethod === method.id ? "border-[var(--color-aqua)]" : "border-[var(--color-border)]"
                      )}>
                        {shippingMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-aqua)]" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{method.label}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{method.desc}</p>
                      </div>
                      <span className="font-bold text-sm">{method.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="w-full h-12 ocean-gradient text-white font-semibold rounded-xl hover:opacity-90"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-[var(--color-aqua)]" />
                  <h3 className="font-heading font-bold">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "payhere_cards", label: "Credit / Debit Card", desc: "Visa, MasterCard via PayHere", icon: "💳" },
                    { id: "payhere_bank", label: "Bank Transfer", desc: "Direct bank transfer via PayHere", icon: "🏦" },
                    { id: "payhere_ezcash", label: "eZ Cash / mCash", desc: "Mobile payment", icon: "📱" },
                    { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive (max Rs 50,000)", icon: "💵" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                        paymentMethod === method.id
                          ? "border-[var(--color-aqua)] bg-[var(--color-aqua)]/5"
                          : "border-[var(--color-border)] hover:border-[var(--color-aqua)]/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        paymentMethod === method.id ? "border-[var(--color-aqua)]" : "border-[var(--color-border)]"
                      )}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-aqua)]" />}
                      </div>
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{method.label}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 h-12 border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-xl hover:bg-[var(--color-muted)]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 h-12 ocean-gradient text-white font-semibold rounded-xl hover:opacity-90"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-white">
                <h3 className="font-heading font-bold mb-4">Order Review</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Please review your order details before placing.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-muted-foreground)]">Shipping to:</span>
                    <span className="font-medium">Colombo, Western Province</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-muted-foreground)]">Delivery method:</span>
                    <span className="font-medium">Standard (2-4 days)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[var(--color-muted-foreground)]">Payment:</span>
                    <span className="font-medium">Credit/Debit Card (PayHere)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 h-12 border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-xl hover:bg-[var(--color-muted)]"
                >
                  Back
                </button>
                <button className="flex-1 h-12 deal-gradient text-white font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  Pay {formatPriceLKR(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-5 rounded-xl border border-[var(--color-border)] bg-white">
            <h3 className="font-heading font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-lg bg-[var(--color-surface)] shrink-0 overflow-hidden">
                  <Image src="https://placehold.co/100x100/003b6f/ffffff?text=RO" alt="RO" width={56} height={56} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Delight Domestic RO Purifier</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">100 GPD | White</p>
                  <p className="text-sm font-bold">Rs 36,500 x 1</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-lg bg-[var(--color-surface)] shrink-0 overflow-hidden">
                  <Image src="https://placehold.co/100x100/e2e8f0/003b6f?text=Filter" alt="Filter" width={56} height={56} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">PP Spun Filter 10 Inch</p>
                  <p className="text-sm font-bold">Rs 850 x 4</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-foreground)]">Subtotal</span>
                <span className="font-medium">{formatPriceLKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-foreground)]">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                <span className="font-heading font-bold">Total</span>
                <span className="font-heading font-bold text-xl text-[var(--color-deal)]">{formatPriceLKR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
