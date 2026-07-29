"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ProductFilters,
  ActiveFiltersBar,
  ProductToolbar,
  FilterState,
} from "@/components/product/ProductFilters";

// Mock products for demonstration
const allProducts = [
  {
    id: "1", slug: "delight-domestic-ro-100", name: "Delight Domestic RO 100 GPD White",
    basePrice: 36500, images: ["https://placehold.co/600x600/003b6f/ffffff?text=RO+100"],
    type: "VARIABLE", isFeatured: true, reviews: [{ rating: 5 }, { rating: 4 }],
    brand: { name: "Delight" }, category: { name: "Domestic RO" },
  },
  {
    id: "2", slug: "delight-domestic-ro-75", name: "Delight Domestic RO 75 GPD Blue",
    basePrice: 32500, images: ["https://placehold.co/600x600/3fc6ff/ffffff?text=RO+75"],
    type: "VARIABLE", reviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }],
    brand: { name: "Delight" }, category: { name: "Domestic RO" },
  },
  {
    id: "3", slug: "delight-commercial-500lph", name: "Delight Commercial RO 500 LPH",
    basePrice: 85000, images: ["https://placehold.co/600x600/00223d/3fc6ff?text=Commercial"],
    type: "VARIABLE", reviews: [{ rating: 5 }],
    brand: { name: "Delight" }, category: { name: "Commercial RO" },
  },
  {
    id: "4", slug: "pp-spun-filter", name: "PP Spun Filter 10 Inch - 5 Micron",
    basePrice: 850, images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Filter"],
    type: "SIMPLE", reviews: [{ rating: 4 }],
    brand: { name: "Generic" }, category: { name: "Spare Parts" },
  },
  {
    id: "5", slug: "ro-antiscalant", name: "RO Antiscalant Chemical 20kg",
    basePrice: 12500, images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Chemical"],
    type: "BULK", reviews: [{ rating: 5 }, { rating: 4 }],
    brand: { name: "Generic" }, category: { name: "Chemicals" },
  },
  {
    id: "6", slug: "uv-lamp-11w", name: "UV Sterilizer Lamp 11W",
    basePrice: 4500, images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=UV+Lamp"],
    type: "SIMPLE", reviews: [{ rating: 4 }, { rating: 5 }],
    brand: { name: "Generic" }, category: { name: "Spare Parts" },
  },
  {
    id: "7", slug: "dow-membrane-8040", name: "DOW FilmTec 8040 RO Membrane",
    basePrice: 45000, images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Membrane"],
    type: "SIMPLE", reviews: [{ rating: 5 }],
    brand: { name: "DOW FilmTec" }, category: { name: "Spare Parts" },
  },
  {
    id: "8", slug: "water-softener-500", name: "Delight Water Softener 500 LPH",
    basePrice: 85000, images: ["https://placehold.co/600x600/003b6f/ffffff?text=Softener"],
    type: "VARIABLE", isFeatured: true, reviews: [{ rating: 4 }, { rating: 5 }],
    brand: { name: "Delight" }, category: { name: "Water Filters" },
  },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    tags: [],
    priceMin: null,
    priceMax: null,
    rating: null,
    inStockOnly: false,
    sortBy: "newest",
  });

  const categoryName = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Filter products based on active filters
  const filteredProducts = allProducts.filter((product) => {
    // Price filter
    if (filters.priceMin && product.basePrice < filters.priceMin) return false;
    if (filters.priceMax && product.basePrice > filters.priceMax) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_asc": return a.basePrice - b.basePrice;
      case "price_desc": return b.basePrice - a.basePrice;
      default: return 0;
    }
  });

  return (
    <>
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--color-muted-foreground)] mb-4">
          <a href="/" className="hover:text-[var(--color-primary)]">Home</a>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-foreground)]">{categoryName}</span>
        </nav>

        {/* Active filters */}
        <ActiveFiltersBar filters={filters} onFilterChange={setFilters} />

        {/* Toolbar */}
        <ProductToolbar
          totalResults={sortedProducts.length}
          filters={filters}
          onFilterChange={setFilters}
          onToggleMobileFilters={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        />

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                categories={[]}
                brands={[]}
                tags={[]}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-2xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-4 flex items-center justify-between">
                  <h2 className="font-heading font-bold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-lg hover:bg-[var(--color-muted)]"
                  >
                    ✕
                  </button>
                </div>
                <ProductFilters
                  categories={[]}
                  brands={[]}
                  tags={[]}
                  filters={filters}
                  onFilterChange={setFilters}
                />
                <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] p-4">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full h-11 ocean-gradient text-white font-semibold rounded-xl"
                  >
                    Show {sortedProducts.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-[var(--color-muted)] flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h2 className="font-heading text-xl font-bold mb-2">No products found</h2>
                <p className="text-[var(--color-muted-foreground)] mb-4">
                  Try adjusting your filters or price range
                </p>
                <button
                  onClick={() => setFilters({
                    categories: [],
                    brands: [],
                    tags: [],
                    priceMin: null,
                    priceMax: null,
                    rating: null,
                    inStockOnly: false,
                    sortBy: "newest",
                  })}
                  className="px-6 py-2.5 ocean-gradient text-white font-medium rounded-full"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
