"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { cn, formatPriceLKR, truncate } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    basePrice: number;
    images: string[];
    type: string;
    isFeatured?: boolean;
    variants?: { price: number; isActive: boolean }[];
    reviews?: { rating: number }[];
    category?: { name: string };
    brand?: { name: string };
  };
  salePrice?: number;
  className?: string;
}

export function ProductCard({ product, salePrice, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate effective price
  const effectivePrice = salePrice || product.basePrice;
  const comparePrice = product.variants?.[0]?.price || product.basePrice;
  const discount = salePrice
    ? Math.round(((product.basePrice - salePrice) / product.basePrice) * 100)
    : null;

  // Calculate rating
  const reviews = product.reviews || [];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:shadow-[var(--color-aqua)]/10 transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-[var(--color-surface)] overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Loading shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer bg-[var(--color-muted)]" />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="px-2 py-0.5 bg-[var(--color-deal)] text-white text-xs font-bold rounded-full">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            {product.type === "VARIABLE" && (
              <span className="px-2 py-0.5 bg-[var(--color-aqua)] text-white text-xs font-medium rounded-full">
                Multi-size
              </span>
            )}
            {product.type === "BULK" && (
              <span className="px-2 py-0.5 bg-[var(--color-success)] text-white text-xs font-medium rounded-full">
                Bulk Pricing
              </span>
            )}
          </div>

          {/* Quick Add to Cart */}
          <button
            className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          size={16}
          className={cn(
            isWishlisted ? "fill-red-500 text-red-500" : "text-[var(--color-muted-foreground)]"
          )}
        />
      </button>

      {/* Content */}
      <Link href={`/products/${product.slug}`} className="block p-3">
        <p className="text-xs text-[var(--color-muted-foreground)] mb-1">
          {product.brand?.name || product.category?.name}
        </p>
        <h3 className="text-sm font-medium text-[var(--color-foreground)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {truncate(product.name, 50)}
        </h3>

        {/* Rating */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    i < Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-[var(--color-border)]"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              ({reviews.length})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-[var(--color-deal)]">
            {formatPriceLKR(effectivePrice)}
          </span>
          {discount && (
            <span className="text-xs text-[var(--color-muted-foreground)] line-through">
              {formatPriceLKR(product.basePrice)}
            </span>
          )}
        </div>

        {/* Product type indicator */}
        {product.type === "COMPOSITE" && (
          <p className="text-xs text-[var(--color-primary)] mt-1 font-medium">
            Build your kit
          </p>
        )}
      </Link>
    </div>
  );
}
