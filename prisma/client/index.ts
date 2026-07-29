// Auto-generated Prisma Client stub
// In production, run `npx prisma generate` to create the full client

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum ProductType {
  SIMPLE = "SIMPLE",
  VARIABLE = "VARIABLE",
  COMPOSITE = "COMPOSITE",
  BULK = "BULK",
}

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  PAYHERE_CARDS = "PAYHERE_CARDS",
  PAYHERE_BANK = "PAYHERE_BANK",
  PAYHERE_EZCASH = "PAYHERE_EZCASH",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export enum CouponType {
  PERCENT = "PERCENT",
  FLAT = "FLAT",
}

export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
  role: UserRole;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  district: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  slug: string;
  description: string | null;
  sku: string;
  basePrice: number;
  categoryId: string;
  brandId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  weight: number | null;
  dimensions: any;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  options: any;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  values: string[];
  createdAt: Date;
}

export interface CompositeItem {
  id: string;
  productId: string;
  componentProductId: string;
  quantity: number;
  isRequired: boolean;
  createdAt: Date;
}

export interface BulkTier {
  id: string;
  productId: string;
  minQty: number;
  price: number;
  createdAt: Date;
}

export interface ProductRelation {
  id: string;
  productId: string;
  relatedId: string;
  createdAt: Date;
}

export interface Cart {
  id: string;
  token: string;
  userId: string | null;
  couponId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  payherePaymentId: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalLkr: number;
  customerNotes: string | null;
  shippingAddressId: string;
  shippingPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export interface FlashSale {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashSaleItem {
  id: string;
  flashSaleId: string;
  productId: string;
  salePrice: number;
  stockLimit: number | null;
  createdAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

// Prisma Client class stub
export class PrismaClient {
  user: any;
  account: any;
  session: any;
  verification: any;
  address: any;
  category: any;
  brand: any;
  product: any;
  productVariant: any;
  productOption: any;
  compositeItem: any;
  bulkTier: any;
  productRelation: any;
  cart: any;
  cartItem: any;
  order: any;
  orderItem: any;
  coupon: any;
  review: any;
  wishlist: any;
  flashSale: any;
  flashSaleItem: any;
  setting: any;

  constructor(options?: any) {
    // Stub - will be replaced by generated client
  }

  async $connect() {}
  async $disconnect() {}
  $on(event: string, callback: Function) {}
  $transaction(fn: any) { return fn(this); }
}

export const Prisma = {
  validator: () => ({}),
};
