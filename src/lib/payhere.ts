import crypto from "crypto";

/**
 * PayHere integration helpers for Sri Lankan payment processing
 * Docs: https://support.payhere.lk/api-/payhere-checkout
 */

const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "";
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || "";
const BASE_URL =
  process.env.PAYHERE_BASE_URL || "https://sandbox.payhere.lk";

/**
 * Generate MD5 hash for PayHere payment authorization
 */
export function generatePayHereHash(
  orderId: string,
  amount: string,
  currency: string = "LKR"
): string {
  // PayHere hash format: md5(merchantId + orderId + amount + currency + md5(merchantSecret))
  const merchantSecretHash = crypto
    .createHash("md5")
    .update(MERCHANT_SECRET)
    .digest("hex")
    .toUpperCase();

  const hash = crypto
    .createHash("md5")
    .update(
      MERCHANT_ID + orderId + amount + currency + merchantSecretHash
    )
    .digest("hex")
    .toUpperCase();

  return hash;
}

/**
 * Verify PayHere IPN (Instant Payment Notification) signature
 */
export function verifyPayHereNotification(
  orderId: string,
  payHereAmount: string,
  payHereCurrency: string,
  statusCode: number,
  md5sig: string
): boolean {
  const merchantSecretHash = crypto
    .createHash("md5")
    .update(MERCHANT_SECRET)
    .digest("hex")
    .toUpperCase();

  const localSig = crypto
    .createHash("md5")
    .update(
      MERCHANT_ID +
        orderId +
        payHereAmount +
        payHereCurrency +
        statusCode +
        merchantSecretHash
    )
    .digest("hex")
    .toUpperCase();

  return localSig === md5sig;
}

/**
 * PayHere payment status codes
 */
export const PAYHERE_STATUS = {
  PENDING: -1,
  CANCELLED: 0,
  ERROR: 1, // MD5 check failed or other processing error
  SUCCESS: 2,
  CHARGEBACK: -3,
  REFUNDED: -2,
  HOLD: -4,
  CAPTURED_FOR_CAPTURE: 18,
  RECOVERED: 20,
} as const;

export type PayHereStatusCode =
  (typeof PAYHERE_STATUS)[keyof typeof PAYHERE_STATUS];

/**
 * Get PayHere payment method labels
 */
export const PAYMENT_METHODS = {
  VISA: "Visa / MasterCard",
  EZCASH: "eZ Cash",
  MCASH: "mCash",
  FRIMI: "FriMi",
  BANK: "Bank Transfer",
  CREDIT_CARD: "Credit / Debit Card",
} as const;

/**
 * Prepare PayHere checkout parameters
 */
export interface PayHereCheckoutParams {
  orderId: string;
  amount: number;
  currency?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryCountry?: string;
  items?: string;
  custom1?: string;
  custom2?: string;
}

export function prepareCheckoutData(params: PayHereCheckoutParams) {
  const amountStr = params.amount.toFixed(2);
  const currency = params.currency || "LKR";
  const hash = generatePayHereHash(params.orderId, amountStr, currency);

  return {
    sandbox: BASE_URL.includes("sandbox"),
    merchant_id: MERCHANT_ID,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${params.orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order_id=${params.orderId}`,
    notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payhere/notify`,
    order_id: params.orderId,
    items: params.items || "Purchase from Delight Water Shop",
    currency,
    amount: amountStr,
    first_name: params.firstName,
    last_name: params.lastName,
    email: params.email,
    phone: params.phone,
    address: params.deliveryAddress || "",
    city: params.deliveryCity || "",
    country: params.deliveryCountry || "Sri Lanka",
    hash,
  };
}

/**
 * Check if PayHere is configured properly
 */
export function isPayHereConfigured(): boolean {
  return Boolean(MERCHANT_ID && MERCHANT_SECRET);
}

/**
 * Get PayHere base URL
 */
export function getPayHereBaseUrl(): string {
  return BASE_URL;
}
