import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { prepareCheckoutData } from "@/lib/payhere";
import { getSession } from "@/lib/auth";
import { calculateShippingCost } from "@/lib/utils";

/**
 * Generate PayHere checkout data for an order
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { orderId, email, phone, firstName, lastName, address, city } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID required" },
        { status: 400 }
      );
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Verify user owns this order (if logged in)
    if (session?.user?.id && order.userId && order.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Prepare checkout data
    const checkoutData = prepareCheckoutData({
      orderId: order.id,
      amount: order.totalLkr,
      firstName: firstName || order.shippingAddress.firstName,
      lastName: lastName || order.shippingAddress.lastName,
      email: email || session?.user?.email || "",
      phone: phone || order.shippingPhone,
      deliveryAddress: address || order.shippingAddress.address1,
      deliveryCity: city || order.shippingAddress.city,
      deliveryCountry: "Sri Lanka",
      items: order.items
        .map((item: any) => `${item.product.name} x${item.quantity}`)
        .join(", "),
      custom1: order.orderNumber,
    });

    return NextResponse.json({
      success: true,
      checkout: checkoutData,
    });
  } catch (error) {
    console.error("PayHere checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
