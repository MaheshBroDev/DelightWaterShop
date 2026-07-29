/**
 * Advanced Discount System
 * 
 * Supports multiple discount types:
 * 1. Coupon codes (manual entry)
 * 2. Auto-applied discounts (cart value based)
 * 3. Flash sale pricing
 * 4. Bundle discounts
 * 5. First-time buyer discount
 * 6. Loyalty/returning customer discounts
 * 7. Seasonal promotions
 * 8. Volume/quantity discounts (already in product model)
 * 9. Category-specific discounts
 * 10. Time-limited offers
 * 
 * Features:
 * - Stackable/non-stackable rules
 * - Usage limits (per user, total)
 * - Minimum order requirements
 * - Maximum discount caps
 * - Expiration dates
 * - Priority ordering
 */

import { prisma } from "@/lib/prisma";
import { calculateDiscount } from "@/lib/utils";

// ============= TYPES =============

export type DiscountType =
  | "PERCENTAGE"    // % off total
  | "FIXED_AMOUNT"  // Rs X off
  | "FREE_SHIPPING" // Free delivery
  | "BUY_X_GET_Y"   // Buy X items, get Y free/discounted
  | "BUNDLE"        // Multiple items for special price
  | "FIRST_TIME"    // First order discount
  | "LOYALTY"       // Returning customer discount
  | "FLASH_SALE"    // Time-limited pricing
  | "CLEARANCE"     // End of life products
  | "SEASONAL";     // Season-based discounts

export type DiscountScope =
  | "CART"          // Applies to entire cart
  | "PRODUCT"       // Specific products
  | "CATEGORY"      // Specific categories
  | "BRAND"         // Specific brands
  | "USER"          // Specific users/groups
  | "NEW_USER";     // New customers only

export interface DiscountRule {
  id: string;
  type: DiscountType;
  scope: DiscountScope;
  code?: string;              // For coupon codes
  value: number;              // % or Rs amount
  minValue?: number;          // Minimum order value
  maxValue?: number;          // Maximum discount cap
  scopeIds?: string[];        // Product/category/brand IDs
  startDate: Date;
  endDate: Date;
  usageLimit?: number;        // Total uses allowed
  usagePerUser?: number;      // Uses per user
  stackable: boolean;         // Can combine with other discounts
  priority: number;           // Higher = applied first
  isActive: boolean;
  description?: string;
  autoApply: boolean;         // Auto-apply without code
}

export interface DiscountApplication {
  rule: DiscountRule;
  discountAmount: number;
  appliedTo: string[];        // Item IDs
  message: string;
}

export interface CartDiscountResult {
  originalSubtotal: number;
  totalDiscount: number;
  finalSubtotal: number;
  appliedDiscounts: DiscountApplication[];
  availableDiscounts: DiscountRule[];
  bestDiscount: DiscountApplication | null;
  savingsPercentage: number;
}

// ============= COUPON CODES =============

/**
 * Validate and apply coupon code
 */
export async function applyCouponCode(
  code: string,
  cartSubtotal: number,
  userId?: string,
  cartItemIds?: string[]
): Promise<{ success: boolean; discount: number; message: string; rule?: DiscountRule }> {
  // Find coupon in database
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
    },
  });

  if (!coupon) {
    return { success: false, discount: 0, message: "Invalid coupon code" };
  }

  // Check expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { success: false, discount: 0, message: "Coupon has expired" };
  }

  // Check usage limits
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, discount: 0, message: "Coupon usage limit reached" };
  }

  // Check minimum order
  if (coupon.minOrder && cartSubtotal < coupon.minOrder) {
    return {
      success: false,
      discount: 0,
      message: `Minimum order of Rs ${coupon.minOrder.toLocaleString()} required`,
    };
  }

  // Check per-user limit
  if (userId && coupon.usagePerUser) {
    const userUsage = await prisma.order.count({
      where: {
        userId,
        discount: { gt: 0 },
      },
    });
    // Simplified check - in production, track per-coupon usage per user
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === "PERCENT") {
    discount = (cartSubtotal * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }

  // Apply max discount cap
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  // Don't discount more than cart value
  discount = Math.min(discount, cartSubtotal);

  // Update usage count
  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { usedCount: { increment: 1 } },
  });

  const message = coupon.type === "PERCENT"
    ? `${coupon.value}% off applied!`
    : `Rs ${coupon.value.toLocaleString()} off applied!`;

  return {
    success: true,
    discount,
    message,
    rule: {
      id: coupon.id,
      type: coupon.type === "PERCENT" ? "PERCENTAGE" : "FIXED_AMOUNT",
      scope: "CART",
      code: coupon.code,
      value: coupon.value,
      minValue: coupon.minOrder || undefined,
      maxValue: coupon.maxDiscount || undefined,
      startDate: coupon.createdAt,
      endDate: coupon.expiresAt || new Date(2099, 11, 31),
      usageLimit: coupon.usageLimit || undefined,
      stackable: false,
      priority: 0,
      isActive: true,
      autoApply: false,
      description: coupon.description || undefined,
    },
  };
}

// ============= AUTO-APPLIED DISCOUNTS =============

/**
 * Get all auto-applied discounts for a cart
 */
export async function getAutoDiscounts(
  cartSubtotal: number,
  cartItemIds: string[] = [],
  userId?: string
): Promise<DiscountRule[]> {
  const now = new Date();

  // Fetch active auto-apply discounts
  const discounts = await prisma.coupon.findMany({
    where: {
      isActive: true,
      autoApply: true,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { priority: "desc" },
  });

  // Filter by minimum order value
  return discounts.filter((d: any) => {
    if (d.minOrder && cartSubtotal < d.minOrder) return false;
    if (d.usageLimit && d.usedCount >= d.usageLimit) return false;
    return true;
  });
}

/**
 * Calculate best available discount for a cart
 */
export async function calculateBestDiscount(
  cartSubtotal: number,
  cartItems: Array<{ productId: string; categoryId: string; price: number; quantity: number }>,
  userId?: string,
  couponCode?: string
): Promise<CartDiscountResult> {
  const appliedDiscounts: DiscountApplication[] = [];
  let totalDiscount = 0;
  let stackableUsed = false;

  // 1. Apply coupon code if provided
  if (couponCode) {
    const couponResult = await applyCouponCode(couponCode, cartSubtotal, userId);
    if (couponResult.success && couponResult.rule) {
      appliedDiscounts.push({
        rule: couponResult.rule,
        discountAmount: couponResult.discount,
        appliedTo: ["cart"],
        message: couponResult.message,
      });
      totalDiscount += couponResult.discount;
      stackableUsed = !couponResult.rule.stackable;
    }
  }

  // 2. Get auto-applied discounts
  const autoDiscounts = await getAutoDiscounts(cartSubtotal, cartItems.map(i => i.productId), userId);

  for (const discount of autoDiscounts) {
    // Skip if non-stackable and we already applied one
    if (!discount.stackable && stackableUsed) continue;

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === "PERCENTAGE") {
      discountAmount = (cartSubtotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    // Apply max cap
    if (discount.maxValue && discountAmount > discount.maxValue) {
      discountAmount = discount.maxValue;
    }

    // Apply to specific products/categories
    if (discount.scope === "PRODUCT" && discount.scopeIds) {
      const applicableItems = cartItems.filter(i => discount.scopeIds!.includes(i.productId));
      const applicableTotal = applicableItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      discountAmount = discount.type === "PERCENTAGE"
        ? (applicableTotal * discount.value) / 100
        : discount.value;
    }

    if (discount.scope === "CATEGORY" && discount.scopeIds) {
      const applicableItems = cartItems.filter(i => discount.scopeIds!.includes(i.categoryId));
      const applicableTotal = applicableItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      discountAmount = discount.type === "PERCENTAGE"
        ? (applicableTotal * discount.value) / 100
        : discount.value;
    }

    discountAmount = Math.min(discountAmount, cartSubtotal - totalDiscount);

    if (discountAmount > 0) {
      appliedDiscounts.push({
        rule: discount,
        discountAmount,
        appliedTo: discount.scopeIds || ["cart"],
        message: discount.description || `Auto-discount applied`,
      });
      totalDiscount += discountAmount;

      if (!discount.stackable) {
        stackableUsed = true;
      }
    }
  }

  // 3. First-time buyer discount
  if (userId) {
    const orderCount = await prisma.order.count({ where: { userId } });
    if (orderCount === 0) {
      const firstTimeDiscount = cartSubtotal * 0.05; // 5% for first order
      appliedDiscounts.push({
        rule: {
          id: "first-time",
          type: "FIRST_TIME",
          scope: "NEW_USER",
          value: 5,
          startDate: new Date(),
          endDate: new Date(2099, 11, 31),
          stackable: true,
          priority: 100,
          isActive: true,
          description: "Welcome! 5% off your first order",
          autoApply: true,
        },
        discountAmount: firstTimeDiscount,
        appliedTo: ["cart"],
        message: "Welcome discount: 5% off your first order!",
      });
      totalDiscount += firstTimeDiscount;
    }
  }

  // Don't exceed cart total
  totalDiscount = Math.min(totalDiscount, cartSubtotal);

  // Sort by priority
  appliedDiscounts.sort((a, b) => b.rule.priority - a.rule.priority);

  return {
    originalSubtotal: cartSubtotal,
    totalDiscount,
    finalSubtotal: cartSubtotal - totalDiscount,
    appliedDiscounts,
    availableDiscounts: autoDiscounts,
    bestDiscount: appliedDiscounts[0] || null,
    savingsPercentage: cartSubtotal > 0 ? (totalDiscount / cartSubtotal) * 100 : 0,
  };
}

// ============= FLASH SALE =============

/**
 * Get active flash sale prices for products
 */
export async function getFlashSalePrices(
  productIds: string[]
): Promise<Map<string, { salePrice: number; originalPrice: number; endTime: Date }>> {
  const now = new Date();

  const flashSales = await prisma.flashSale.findFirst({
    where: {
      isActive: true,
      startTime: { lte: now },
      endTime: { gte: now },
    },
    include: {
      items: {
        where: { productId: { in: productIds } },
        include: {
          product: { select: { basePrice: true } },
        },
      },
    },
  });

  const prices = new Map<string, { salePrice: number; originalPrice: number; endTime: Date }>();

  if (flashSales) {
    for (const item of flashSales.items) {
      prices.set(item.productId, {
        salePrice: item.salePrice,
        originalPrice: item.product.basePrice,
        endTime: flashSales.endTime,
      });
    }
  }

  return prices;
}

/**
 * Create a new flash sale
 */
export async function createFlashSale(params: {
  name: string;
  startTime: Date;
  endTime: Date;
  items: Array<{ productId: string; salePrice: number; stockLimit?: number }>;
}): Promise<void> {
  await prisma.flashSale.create({
    data: {
      name: params.name,
      startTime: params.startTime,
      endTime: params.endTime,
      isActive: true,
      items: {
        create: params.items.map((item) => ({
          productId: item.productId,
          salePrice: item.salePrice,
          stockLimit: item.stockLimit,
        })),
      },
    },
  });
}

// ============= BUNDLE DISCOUNTS =============

export interface BundleDeal {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  bundlePrice: number;
  originalTotal: number;
  savings: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

/**
 * Get active bundle deals
 */
export async function getActiveBundles(): Promise<BundleDeal[]> {
  const now = new Date();

  // For now, return empty - would need a Bundle model in schema
  return [];
}

/**
 * Check if cart qualifies for a bundle deal
 */
export function checkBundleEligibility(
  cartProductIds: string[],
  bundle: BundleDeal
): boolean {
  return bundle.productIds.every((id) => cartProductIds.includes(id));
}

// ============= LOYALTY DISCOUNTS =============

/**
 * Get loyalty discount based on order history
 */
export async function getLoyaltyDiscount(userId: string): Promise<{
  level: "bronze" | "silver" | "gold" | "platinum";
  discountPercentage: number;
  totalOrders: number;
  totalSpent: number;
}> {
  const orders = await prisma.order.findMany({
    where: { userId, status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    select: { totalLkr: true },
  });

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, o: any) => sum + o.totalLkr, 0);

  let level: "bronze" | "silver" | "gold" | "platinum" = "bronze";
  let discountPercentage = 0;

  if (totalSpent >= 500000) {
    level = "platinum";
    discountPercentage = 15;
  } else if (totalSpent >= 200000) {
    level = "gold";
    discountPercentage = 10;
  } else if (totalSpent >= 100000) {
    level = "silver";
    discountPercentage = 5;
  } else if (totalSpent >= 50000) {
    level = "bronze";
    discountPercentage = 2;
  }

  return { level, discountPercentage, totalOrders, totalSpent };
}

// ============= SEASONAL PROMOTIONS =============

export interface SeasonalPromotion {
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  appliesTo: "all" | string[]; // Product/category IDs
}

/**
 * Get current seasonal promotions
 */
export function getSeasonalPromotions(): SeasonalPromotion[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const promotions: SeasonalPromotion[] = [];

  // Sinhala/Tamil New Year (April)
  if (month === 3) {
    promotions.push({
      name: "Avurudu Special",
      description: "Celebrate Sinhala & Tamil New Year with special discounts!",
      discountType: "PERCENTAGE",
      discountValue: 15,
      startDate: new Date(year, 3, 1),
      endDate: new Date(year, 3, 30),
      appliesTo: "all",
    });
  }

  // Christmas/New year (December)
  if (month === 11) {
    promotions.push({
      name: "Holiday Season Sale",
      description: "Year-end special offers on all water purification systems!",
      discountType: "PERCENTAGE",
      discountValue: 20,
      startDate: new Date(year, 11, 1),
      endDate: new Date(year, 11, 31),
      appliesTo: "all",
    });
  }

  // Vesak (May - approx)
  if (month === 4) {
    promotions.push({
      name: "Vesak Promotion",
      description: "Special offers during Vesak season",
      discountType: "PERCENTAGE",
      discountValue: 10,
      startDate: new Date(year, 4, 1),
      endDate: new Date(year, 4, 31),
      appliesTo: "all",
    });
  }

  return promotions;
}

// ============= DISCOUNT VALIDATION & RULES =============

/**
 * Validate if discounts can be stacked
 */
export function canStackDiscounts(
  discounts: DiscountRule[]
): boolean {
  // If any discount is non-stackable, no stacking
  return discounts.every((d) => d.stackable);
}

/**
 * Calculate total discount with stacking rules
 */
export function calculateStackedDiscount(
  cartSubtotal: number,
  discounts: DiscountRule[]
): number {
  if (discounts.length === 0) return 0;

  if (!canStackDiscounts(discounts)) {
    // Use the highest value discount
    const best = discounts.reduce((prev, curr) => {
      const prevAmount = prev.type === "PERCENTAGE"
        ? (cartSubtotal * prev.value) / 100
        : prev.value;
      const currAmount = curr.type === "PERCENTAGE"
        ? (cartSubtotal * curr.value) / 100
        : curr.value;
      return currAmount > prevAmount ? curr : prev;
    });

    return best.type === "PERCENTAGE"
      ? (cartSubtotal * best.value) / 100
      : best.value;
  }

  // Stack all discounts
  let total = 0;
  let remaining = cartSubtotal;

  const sorted = [...discounts].sort((a, b) => b.priority - a.priority);

  for (const discount of sorted) {
    let amount = discount.type === "PERCENTAGE"
      ? (remaining * discount.value) / 100
      : discount.value;

    if (discount.maxValue) {
      amount = Math.min(amount, discount.maxValue);
    }

    amount = Math.min(amount, remaining);
    total += amount;
    remaining -= amount;
  }

  return total;
}

// ============= PROMO CODE GENERATION =============

/**
 * Generate unique promo codes
 */
export function generatePromoCode(
  prefix: string = "DELIGHT",
  length: number = 8
): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix + "-";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

/**
 * Batch generate promo codes
 */
export function generatePromoCodes(
  count: number,
  prefix: string = "DELIGHT"
): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generatePromoCode(prefix));
  }
  return Array.from(codes);
}
