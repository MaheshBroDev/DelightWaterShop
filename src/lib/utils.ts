import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx for conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Sri Lankan Rupees (LKR)
 * Example: 24500 -> "Rs 24,500.00"
 */
export function formatPriceLKR(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DWS-${timestamp}-${random}`;
}

/**
 * Generate a unique cart token for guest users
 */
export function generateCartToken(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  subtotal: number,
  couponType: "PERCENT" | "FLAT",
  couponValue: number,
  maxDiscount?: number
): number {
  let discount = 0;

  if (couponType === "PERCENT") {
    discount = (subtotal * couponValue) / 100;
  } else {
    discount = couponValue;
  }

  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount;
  }

  return Math.min(discount, subtotal);
}

/**
 * Get stock status text
 */
export function getStockStatus(stock: number): {
  status: "in_stock" | "low_stock" | "out_of_stock";
  text: string;
  color: string;
} {
  if (stock === 0) {
    return {
      status: "out_of_stock",
      text: "Out of Stock",
      color: "text-red-600",
    };
  } else if (stock <= 5) {
    return {
      status: "low_stock",
      text: `Low Stock (${stock} left)`,
      color: "text-orange-600",
    };
  } else {
    return {
      status: "in_stock",
      text: "In Stock",
      color: "text-green-600",
    };
  }
}

/**
 * Sri Lanka districts for shipping addresses
 */
export const SL_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
] as const;

/**
 * Get shipping cost based on order total and district
 */
export function calculateShippingCost(
  subtotal: number,
  district: string,
  freeShippingThreshold: number = 25000
): number {
  // Free shipping above threshold
  if (subtotal >= freeShippingThreshold) {
    return 0;
  }

  // Western province (Colombo, Gampaha, Kalutara) - lower rate
  const westernProvince = ["Colombo", "Gampaha", "Kalutara"];
  if (westernProvince.includes(district)) {
    return 500;
  }

  // Other districts - higher rate
  return 800;
}

/**
 * Truncate text to a specific length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

/**
 * Get time ago string
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "Just now";
}
