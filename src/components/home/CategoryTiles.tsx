import Link from "next/link";
import Image from "next/image";
import {
  Droplets,
  Filter,
  Settings,
  FlaskConical,
  Wrench,
  Waves,
  Thermometer,
  Gauge,
} from "lucide-react";

const categories = [
  {
    name: "Domestic RO",
    slug: "domestic-ro-plants",
    icon: Droplets,
    color: "bg-[var(--color-aqua)]/10",
    iconColor: "text-[var(--color-water)]",
    count: 12,
  },
  {
    name: "Commercial RO",
    slug: "commercial-ro-plants",
    icon: Waves,
    color: "bg-[var(--color-primary)]/10",
    iconColor: "text-[var(--color-primary)]",
    count: 8,
  },
  {
    name: "Industrial RO",
    slug: "industrial-ro-plants",
    icon: Gauge,
    color: "bg-[var(--color-deep)]/10",
    iconColor: "text-[var(--color-deep)]",
    count: 5,
  },
  {
    name: "Water Filters",
    slug: "water-filters",
    icon: Filter,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    count: 15,
  },
  {
    name: "Spare Parts",
    slug: "spare-parts",
    icon: Settings,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    count: 25,
  },
  {
    name: "Chemicals",
    slug: "chemicals-consumables",
    icon: FlaskConical,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
    count: 18,
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: Wrench,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
    count: 20,
  },
  {
    name: "Sea Water RO",
    slug: "sea-water-ro",
    icon: Thermometer,
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
    count: 3,
  },
];

export function CategoryTiles() {
  return (
    <section>
      <h2 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-[var(--color-foreground)]">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-aqua)] hover:shadow-md hover:shadow-[var(--color-aqua)]/10 transition-all group"
            >
              <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={cat.iconColor} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
