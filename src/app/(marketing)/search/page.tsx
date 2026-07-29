"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Search as SearchIcon } from "lucide-react";

const mockResults = [
  {
    id: "1",
    slug: "delight-domestic-ro-plant",
    name: "Delight Domestic RO Water Purifier",
    basePrice: 36500,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO"],
    type: "VARIABLE",
    reviews: [{ rating: 5 }, { rating: 4 }],
    brand: { name: "Delight" },
    category: { name: "Domestic RO" },
  },
  {
    id: "2",
    slug: "ro-boost-pump-24v",
    name: "RO Booster Pump 24V DC",
    basePrice: 5500,
    images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=RO+Pump"],
    type: "SIMPLE",
    reviews: [{ rating: 4 }],
    brand: { name: "Generic" },
    category: { name: "Spare Parts" },
  },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">
          {query ? (
            <>
              Search results for &ldquo;<span className="text-[var(--color-primary)]">{query}</span>&rdquo;
            </>
          ) : (
            "Search Products"
          )}
        </h1>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-1">
          {mockResults.length} results found
        </p>
      </div>

      {mockResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <SearchIcon size={48} className="mx-auto text-[var(--color-muted-foreground)]/30 mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">No results found</h2>
          <p className="text-[var(--color-muted-foreground)]">
            Try different keywords or check for typos
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1440px] mx-auto px-4 py-6">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
