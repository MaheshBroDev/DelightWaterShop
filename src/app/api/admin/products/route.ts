import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

/**
 * POST /api/admin/products - Create new product
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify admin authentication and permissions
    // const session = await getSession();
    // if (!session || !hasPermission(session.user.role, AdminPermission.PRODUCTS_CREATE)) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    // }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      sku,
      type,
      categoryId,
      brandId,
      basePrice,
      compareAtPrice,
      weight,
      status,
      isFeatured,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImage,
      canonicalUrl,
    } = body;

    // Validation
    if (!name || !slug || !sku || !categoryId || !basePrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, message: "Product slug already exists" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        sku,
        type,
        categoryId,
        brandId,
        basePrice: parseFloat(basePrice),
        status: status || "DRAFT",
        isActive: status === "PUBLISHED",
        isFeatured: isFeatured || false,
        weight: weight ? parseFloat(weight) : null,
        images: images || [],
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || [],
        ogImage,
        canonicalUrl,
        // TODO: Set createdById from session
      },
    });

    // Log the creation
    await prisma.productChange.create({
      data: {
        productId: product.id,
        userId: "system", // TODO: from session
        userName: "System", // TODO: from session
        action: "created",
        newValue: { status: product.status },
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/products - List products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");

    const where: any = {};

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          brand: true,
          _count: {
            select: { variants: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("List products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
