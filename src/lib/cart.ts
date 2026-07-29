import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { generateCartToken } from "./utils";

const CART_COOKIE_NAME = "delight_cart_token";

/**
 * Get or create cart token from cookies
 */
export async function getCartToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!token) {
    token = generateCartToken();
    cookieStore.set(CART_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return token;
}

/**
 * Get the cart for current user or guest
 */
export async function getCart(userId?: string) {
  if (userId) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { brand: true, category: true },
            },
            variant: true,
          },
        },
        coupon: true,
      },
    });
  }

  const token = await getCartToken();
  return prisma.cart.findUnique({
    where: { token },
    include: {
      items: {
        include: {
          product: {
            include: { brand: true, category: true },
          },
          variant: true,
        },
      },
      coupon: true,
    },
  });
}

/**
 * Create a new cart
 */
export async function createCart(
  userId?: string,
  token?: string
) {
  return prisma.cart.create({
    data: {
      userId,
      token: userId ? undefined : token || (await getCartToken()),
    },
  });
}

/**
 * Add item to cart
 */
export async function addToCart(params: {
  productId: string;
  variantId?: string;
  quantity: number;
  userId?: string;
}) {
  const { productId, variantId, quantity, userId } = params;

  let cart;

  if (userId) {
    cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await createCart(userId);
    }
  } else {
    const token = await getCartToken();
    cart = await prisma.cart.findUnique({ where: { token } });
    if (!cart) {
      cart = await createCart(undefined, token);
    }
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId_variantId: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    },
  });

  if (existingItem) {
    // Update quantity
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true, variant: true },
    });
  }

  // Create new item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId,
      quantity,
    },
    include: { product: true, variant: true },
  });
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true, variant: true },
  });
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

/**
 * Apply coupon to cart
 */
export async function applyCoupon(cartId: string, couponCode: string) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  // Get cart subtotal
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const subtotal = cart.items.reduce((sum: number, item: any) => {
    const price = item.variant?.price || item.product.basePrice;
    return sum + price * item.quantity;
  }, 0);

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    throw new Error(
      `Minimum order value of Rs ${coupon.minOrder.toLocaleString()} required`
    );
  }

  // Apply coupon
  return prisma.cart.update({
    where: { id: cartId },
    data: { couponId: coupon.id },
    include: {
      items: {
        include: { product: true, variant: true },
      },
      coupon: true,
    },
  });
}

/**
 * Remove coupon from cart
 */
export async function removeCoupon(cartId: string) {
  return prisma.cart.update({
    where: { id: cartId },
    data: { couponId: null },
    include: {
      items: {
        include: { product: true, variant: true },
      },
    },
  });
}

/**
 * Merge guest cart into user cart on login
 */
export async function mergeGuestCart(userId: string) {
  const token = await getCartToken();

  const guestCart = await prisma.cart.findUnique({
    where: { token },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    return;
  }

  let userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    // Just assign guest cart to user
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId, token: null },
    });
    return;
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_variantId: {
          cartId: userCart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + guestItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
        },
      });
    }
  }

  // Delete guest cart
  await prisma.cart.delete({ where: { id: guestCart.id } });
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(
  items: { quantity: number; product: { basePrice: number }; variant?: { price: number } | null }[],
  coupon?: { type: "PERCENT" | "FLAT"; value: number; maxDiscount?: number | null } | null
) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.basePrice;
    return sum + price * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === "PERCENT") {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    discount = Math.min(discount, subtotal);
  }

  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
  };
}

/**
 * Clear cart
 */
export async function clearCart(cartId: string) {
  return prisma.cart.update({
    where: { id: cartId },
    data: {
      items: { deleteMany: {} },
      couponId: null,
    },
  });
}
