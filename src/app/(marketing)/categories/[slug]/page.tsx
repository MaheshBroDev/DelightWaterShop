import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    slug: "delight-domestic-ro-plant",
    name: "Delight Domestic RO Water Purifier 100 GPD",
    basePrice: 36500,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO"],
    type: "VARIABLE",
    isFeatured: true,
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Domestic RO" },
  },
  {
    id: "2",
    slug: "delight-domestic-ro-plant-75",
    name: "Delight Domestic RO Water Purifier 75 GPD",
    basePrice: 32500,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO+75"],
    type: "VARIABLE",
    isFeatured: false,
    reviews: [{ rating: 4 }, { rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Domestic RO" },
  },
  {
    id: "3",
    slug: "delight-domestic-ro-plant-150",
    name: "Delight Domestic RO Water Purifier 150 GPD",
    basePrice: 42500,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO+150"],
    type: "VARIABLE",
    isFeatured: false,
    reviews: [{ rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Domestic RO" },
  },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 p-5 rounded-xl border border-[var(--color-border)] bg-white">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={18} />
                <h3 className="font-heading font-bold">Filters</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Category</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      All Domestic RO
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      75 GPD
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      100 GPD
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      150 GPD
                    </label>
                  </li>
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)]"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Brand</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      Delight
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      DOW FilmTec
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[var(--color-border)]" />
                      Pentair
                    </label>
                  </li>
                </ul>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-medium text-sm mb-2">Rating</h4>
                <ul className="space-y-1.5 text-sm">
                  {[4, 3, 2, 1].map((rating) => (
                    <li key={rating}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[var(--color-border)]" />
                        {"★".repeat(rating)}{"☆".repeat(5 - rating)} & up
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl border border-[var(--color-border)] bg-white">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                <span className="font-medium text-[var(--color-foreground)]">{mockProducts.length}</span> products found
              </p>
              <div className="flex items-center gap-3">
                <select className="h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white">
                  <option>Best Match</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Top Rated</option>
                </select>
                <div className="hidden sm:flex gap-1">
                  <button className="p-2 rounded-lg bg-[var(--color-muted)]">
                    <Grid3X3 size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--color-muted)]">
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
