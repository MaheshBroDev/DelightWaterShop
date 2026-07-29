import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FlashSale } from "@/components/home/FlashSale";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { TrustBadges } from "@/components/home/TrustBadges";
import { ProductCard } from "@/components/product/ProductCard";
import { Droplets, TrendingUp, Sparkles } from "lucide-react";

// Mock data for now - will be fetched from database
const featuredProducts = [
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
    slug: "delight-commercial-ro-plant",
    name: "Delight Commercial RO System 500 LPH",
    basePrice: 85000,
    images: ["https://placehold.co/600x600/00223d/3fc6ff?text=Commercial+RO"],
    type: "VARIABLE",
    isFeatured: true,
    reviews: [{ rating: 5 }, { rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Commercial RO" },
  },
  {
    id: "3",
    slug: "ro-antiscalant-chemical-20kg",
    name: "RO Antiscalant Chemical 20kg Drum",
    basePrice: 12500,
    images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=Antiscalant"],
    type: "BULK",
    isFeatured: false,
    reviews: [{ rating: 4 }],
    brand: { name: "Generic" },
    category: { name: "Chemicals" },
  },
  {
    id: "4",
    slug: "delight-water-softener-system",
    name: "Delight Water Softener System 500 LPH",
    basePrice: 85000,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Water+Softener"],
    type: "VARIABLE",
    isFeatured: true,
    reviews: [{ rating: 5 }, { rating: 4 }],
    brand: { name: "Delight" },
    category: { name: "Water Filters" },
  },
  {
    id: "5",
    slug: "pp-spun-filter-10-inch",
    name: "PP Spun Filter 10 Inch - 5 Micron",
    basePrice: 850,
    images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=PP+Filter"],
    type: "SIMPLE",
    isFeatured: false,
    reviews: [{ rating: 4 }, { rating: 5 }],
    brand: { name: "Generic" },
    category: { name: "Spare Parts" },
  },
  {
    id: "6",
    slug: "digital-tds-meter",
    name: "Digital TDS Meter",
    basePrice: 2500,
    images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=TDS+Meter"],
    type: "SIMPLE",
    isFeatured: true,
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    brand: { name: "Generic" },
    category: { name: "Accessories" },
  },
  {
    id: "7",
    slug: "uv-sterilizer-lamp-11w",
    name: "UV Sterilizer Lamp 11W",
    basePrice: 4500,
    images: ["https://placehold.co/600x600/e2e8f0/003b6f?text=UV+Lamp"],
    type: "SIMPLE",
    isFeatured: false,
    reviews: [{ rating: 4 }],
    brand: { name: "Generic" },
    category: { name: "Spare Parts" },
  },
  {
    id: "8",
    slug: "industrial-ro-plant-custom-build",
    name: "Industrial RO Plant - Custom Build Kit",
    basePrice: 250000,
    images: ["https://placehold.co/600x600/001224/3fc6ff?text=Industrial+RO"],
    type: "COMPOSITE",
    isFeatured: true,
    reviews: [{ rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Industrial RO" },
  },
];

const flashSaleProducts = [
  {
    id: "1",
    slug: "delight-domestic-ro-plant",
    name: "Delight Domestic RO Water Purifier",
    basePrice: 32500,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Delight+RO"],
    type: "VARIABLE",
    reviews: [{ rating: 5 }, { rating: 4 }],
    brand: { name: "Delight" },
    category: { name: "Domestic RO" },
    salePrice: 27500,
    soldPercent: 65,
  },
  {
    id: "2",
    slug: "delight-commercial-ro-plant",
    name: "Delight Commercial RO System",
    basePrice: 85000,
    images: ["https://placehold.co/600x600/00223d/3fc6ff?text=Commercial+RO"],
    type: "VARIABLE",
    reviews: [{ rating: 5 }],
    brand: { name: "Delight" },
    category: { name: "Commercial RO" },
    salePrice: 72000,
    soldPercent: 40,
  },
  {
    id: "4",
    slug: "delight-water-softener-system",
    name: "Delight Water Softener System",
    basePrice: 65000,
    images: ["https://placehold.co/600x600/003b6f/ffffff?text=Water+Softener"],
    type: "VARIABLE",
    reviews: [{ rating: 4 }],
    brand: { name: "Delight" },
    category: { name: "Water Filters" },
    salePrice: 55000,
    soldPercent: 30,
  },
];

export default function HomePage() {
  // Flash sale ends 7 days from now
  const flashSaleEnd = new Date();
  flashSaleEnd.setDate(flashSaleEnd.getDate() + 7);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-4 py-6">
          <HeroSlider />
        </section>

        {/* Flash Sale */}
        <section className="max-w-[1440px] mx-auto px-4 py-6">
          <FlashSale endTime={flashSaleEnd.toISOString()} products={flashSaleProducts} />
        </section>

        {/* Categories */}
        <section className="max-w-[1440px] mx-auto px-4 py-6">
          <CategoryTiles />
        </section>

        {/* Featured Products */}
        <section className="max-w-[1440px] mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={24} className="text-[var(--color-aqua)]" />
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">
                Featured Products
              </h2>
            </div>
            <a
              href="/products"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-[1440px] mx-auto px-4">
          <TrustBadges />
        </section>

        {/* Newsletter */}
        <section className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl ocean-gradient p-8 sm:p-12 text-center text-white">
            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${30 + Math.random() * 50}px`,
                    height: `${30 + Math.random() * 50}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: "-60px",
                    animation: `bubble ${8 + Math.random() * 6}s linear infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Droplets size={32} className="text-white" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                Stay Updated
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Subscribe to get exclusive offers, new product alerts, and water treatment tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-full hover:scale-105 transition-transform">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
