import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  calculateCartTotals,
} from "@/lib/cart";
import { getSession } from "@/lib/auth";

/**
 * GET /api/cart - Get current cart
 */
export async function GET() {
  try {
    const session = await getSession();
    const cart = await getCart(session?.user?.id);

    if (!cart) {
      return NextResponse.json({ cart: null, items: [], totals: null });
    }

    const totals = calculateCartTotals(cart.items, cart.coupon);

    return NextResponse.json({
      cart,
      items: cart.items,
      coupon: cart.coupon,
      totals,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart - Add item to cart or apply coupon
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { action } = body;

    // Apply coupon
    if (action === "apply_coupon") {
      const { couponCode } = body;
      const cart = await getCart(session?.user?.id);

      if (!cart) {
        return NextResponse.json(
          { success: false, message: "Cart is empty" },
          { status: 400 }
        );
      }

      const updatedCart = await applyCoupon(cart.id, couponCode);
      const totals = calculateCartTotals(updatedCart.items, updatedCart.coupon);

      return NextResponse.json({
        success: true,
        cart: updatedCart,
        totals,
        message: "Coupon applied successfully",
      });
    }

    // Add to cart
    const { productId, variantId, quantity } = body;

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const cartItem = await addToCart({
      productId,
      variantId,
      quantity: parseInt(quantity),
      userId: session?.user?.id,
    });

    const cart = await getCart(session?.user?.id);
    const totals = cart ? calculateCartTotals(cart.items, cart.coupon) : null;

    return NextResponse.json({
      success: true,
      item: cartItem,
      cart,
      totals,
      message: "Added to cart",
    });
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal error" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/cart - Update cart item
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { action, itemId, quantity, couponCode } = body;

    // Remove coupon
    if (action === "remove_coupon") {
      const cart = await getCart(session?.user?.id);
      if (!cart) {
        return NextResponse.json(
          { success: false, message: "Cart is empty" },
          { status: 400 }
        );
      }

      const updatedCart = await removeCoupon(cart.id);
      const totals = calculateCartTotals(updatedCart.items, null);

      return NextResponse.json({
        success: true,
        cart: updatedCart,
        totals,
        message: "Coupon removed",
      });
    }

    // Update quantity
    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID required" },
        { status: 400 }
      );
    }

    const updatedItem = await updateCartItemQuantity(
      itemId,
      quantity ? parseInt(quantity) : 0
    );

    const cart = await getCart(session?.user?.id);
    const totals = cart ? calculateCartTotals(cart.items, cart.coupon) : null;

    return NextResponse.json({
      success: true,
      item: updatedItem,
      cart,
      totals,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart - Remove item from cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID required" },
        { status: 400 }
      );
    }

    await removeFromCart(itemId);

    const cart = await getCart(session?.user?.id);
    const totals = cart ? calculateCartTotals(cart.items, cart.coupon) : null;

    return NextResponse.json({
      success: true,
      cart,
      totals,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
