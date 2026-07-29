import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayHereNotification, PAYHERE_STATUS } from "@/lib/payhere";

/**
 * PayHere IPN (Instant Payment Notification) endpoint
 * This is called server-to-server by PayHere after payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const merchantId = params.get("merchant_id");
    const orderId = params.get("order_id");
    const payhereAmount = params.get("payhere_amount");
    const currency = params.get("currency");
    const statusCode = parseInt(params.get("status_code") || "-1");
    const md5sig = params.get("md5sig");
    const paymentId = params.get("payment_id");
    const method = params.get("method");
    const statusMessage = params.get("status_message");

    console.log("PayHere IPN received:", {
      orderId,
      statusCode,
      payhereAmount,
      currency,
    });

    // Verify the notification signature
    if (
      !orderId ||
      !payhereAmount ||
      !currency ||
      !md5sig ||
      statusCode === undefined
    ) {
      console.error("Missing required PayHere IPN parameters");
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    const isValid = verifyPayHereNotification(
      orderId,
      payhereAmount,
      currency,
      statusCode,
      md5sig
    );

    if (!isValid) {
      console.error("Invalid PayHere IPN signature for order:", orderId);
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Verify amount matches
    const expectedAmount = order.totalLkr.toFixed(2);
    if (payhereAmount !== expectedAmount) {
      console.error(
        `Amount mismatch: expected ${expectedAmount}, got ${payhereAmount}`
      );
      return NextResponse.json(
        { success: false, message: "Amount mismatch" },
        { status: 400 }
      );
    }

    // Update order based on status
    let newStatus = order.status;

    switch (statusCode) {
      case PAYHERE_STATUS.SUCCESS:
        newStatus = "PAID";
        break;
      case PAYHERE_STATUS.PENDING:
        newStatus = "PENDING_PAYMENT";
        break;
      case PAYHERE_STATUS.CANCELLED:
        newStatus = "CANCELLED";
        break;
      case PAYHERE_STATUS.REFUNDED:
        newStatus = "REFUNDED";
        break;
      case PAYHERE_STATUS.CHARGEBACK:
        newStatus = "REFUNDED";
        break;
      case PAYHERE_STATUS.ERROR:
        console.error("PayHere error:", statusMessage);
        return NextResponse.json(
          { success: false, message: "Payment error" },
          { status: 400 }
        );
      default:
        console.warn("Unknown PayHere status:", statusCode);
    }

    // Update the order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        payherePaymentId: paymentId,
        paymentMethod: mapPayHereMethod(method),
      },
    });

    console.log(
      `Order ${orderId} updated to status ${newStatus}`
    );

    // TODO: Send email notification
    // await sendOrderConfirmationEmail(order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayHere IPN error:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}

function mapPayHereMethod(method: string | null): "PAYHERE_CARDS" | "PAYHERE_BANK" | "PAYHERE_EZCASH" {
  if (!method) return "PAYHERE_CARDS";
  
  const m = method.toLowerCase();
  if (m.includes("ezcash") || m.includes("mcash")) return "PAYHERE_EZCASH";
  if (m.includes("bank")) return "PAYHERE_BANK";
  return "PAYHERE_CARDS";
}
