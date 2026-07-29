import { prisma } from "./prisma";
import { ProductType } from "@prisma/client";

/**
 * Get product by slug with all relations
 */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      brand: true,
      variants: { where: { isActive: true } },
      options: true,
      bulkTiers: { orderBy: { minQty: "asc" } },
      compositeItems: {
        include: {
          componentProduct: {
            include: {
              variants: { where: { isActive: true } },
            },
          },
        },
      },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      relatedFrom: {
        include: {
          related: {
            include: {
              variants: { where: { isActive: true }, take: 1 },
            },
          },
        },
      },
    },
  });
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      variants: true,
      options: true,
      bulkTiers: { orderBy: { minQty: "asc" } },
      compositeItems: {
        include: {
          componentProduct: true,
        },
      },
    },
  });
}

/**
 * List products with filters, sorting, and pagination
 */
export interface ListProductsParams {
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "popular";
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  type?: ProductType;
}

export async function listProducts(params: ListProductsParams = {}) {
  const {
    categoryId,
    brandId,
    search,
    minPrice,
    maxPrice,
    sortBy = "newest",
    page = 1,
    limit = 24,
    isFeatured,
    type,
  } = params;

  const where: any = { isActive: true };

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;
  if (isFeatured !== undefined) where.isFeatured = isFeatured;
  if (type) where.type = type;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  switch (sortBy) {
    case "price_asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price_desc":
      orderBy = { basePrice: "desc" };
      break;
    case "rating":
      orderBy = [{ reviews: { _count: "desc" } }];
      break;
    case "popular":
      orderBy = [{ orderItems: { _count: "desc" } }];
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        brand: true,
        variants: {
          where: { isActive: true },
          take: 1,
        },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get all categories with product count
 */
export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      },
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return categories;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      },
      products: {
        where: { isActive: true },
        take: 4,
        include: {
          variants: { where: { isActive: true }, take: 1 },
        },
      },
    },
  });
}

/**
 * Get all brands
 */
export async function getBrands() {
  return prisma.brand.findMany({
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Get active flash sale with items
 */
export async function getActiveFlashSale() {
  const now = new Date();
  return prisma.flashSale.findFirst({
    where: {
      isActive: true,
      startTime: { lte: now },
      endTime: { gte: now },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              variants: { where: { isActive: true }, take: 1 },
            },
          },
        },
      },
    },
  });
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 12) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    include: {
      category: true,
      brand: true,
      variants: { where: { isActive: true }, take: 1 },
      reviews: {
        where: { isApproved: true },
        select: { rating: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Calculate average rating for a product
 */
export function calculateAverageRating(
  reviews: { rating: number }[]
): { average: number; count: number } {
  if (reviews.length === 0) return { average: 0, count: 0 };

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/**
 * Get the best price from variants (lowest)
 */
export function getBestPrice(product: {
  basePrice: number;
  variants: { price: number; isActive: boolean }[];
}): number {
  const activeVariants = product.variants.filter((v) => v.isActive);
  if (activeVariants.length === 0) return product.basePrice;

  const lowestVariantPrice = Math.min(
    ...activeVariants.map((v) => v.price)
  );
  return Math.min(lowestVariantPrice, product.basePrice);
}

/**
 * Get bulk tier price for quantity
 */
export function getBulkPrice(
  bulkTiers: { minQty: number; price: number }[],
  quantity: number
): { price: number; tier?: { minQty: number; price: number } } {
  const applicableTier = bulkTiers
    .filter((tier) => quantity >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0];

  if (applicableTier) {
    return { price: applicableTier.price, tier: applicableTier };
  }

  return { price: 0 };
}
