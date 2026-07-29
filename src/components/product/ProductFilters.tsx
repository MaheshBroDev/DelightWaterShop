"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  X,
  SlidersHorizontal,
  Tag,
  Filter,
} from "lucide-react";
import { cn, formatPriceLKR, SL_DISTRICTS } from "@/lib/utils";

// ============= TYPES =============

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  children?: Category[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  count: number;
  logo?: string;
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color?: string;
  count: number;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  tags: string[];
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  tags: TagItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxPrice?: number;
  className?: string;
}

// ============= MOCK DATA =============

const mockCategories: Category[] = [
  {
    id: "1", name: "RO Water Purifiers", slug: "ro-water-purifiers", count: 25,
    children: [
      { id: "1a", name: "Domestic RO", slug: "domestic-ro", count: 12 },
      { id: "1b", name: "Commercial RO", slug: "commercial-ro", count: 8 },
      { id: "1c", name: "Industrial RO", slug: "industrial-ro", count: 5 },
    ],
  },
  {
    id: "2", name: "Water Filters", slug: "water-filters", count: 15,
    children: [
      { id: "2a", name: "DM/DI Plants", slug: "dm-di-plants", count: 4 },
      { id: "2b", name: "Water Softeners", slug: "water-softeners", count: 6 },
      { id: "2c", name: "Iron Removal", slug: "iron-removal", count: 5 },
    ],
  },
  {
    id: "3", name: "Spare Parts", slug: "spare-parts", count: 30,
    children: [
      { id: "3a", name: "Membranes", slug: "membranes", count: 8 },
      { id: "3b", name: "Pumps", slug: "pumps", count: 6 },
      { id: "3c", name: "Housings", slug: "housings", count: 10 },
      { id: "3d", name: "UV Lamps", slug: "uv-lamps", count: 6 },
    ],
  },
  {
    id: "4", name: "Chemicals", slug: "chemicals", count: 18,
    children: [
      { id: "4a", name: "Filters", slug: "filters", count: 8 },
      { id: "4b", name: "Antiscalant", slug: "antiscalant", count: 4 },
      { id: "4c", name: "Resin", slug: "resin", count: 6 },
    ],
  },
];

const mockBrands: Brand[] = [
  { id: "1", name: "Delight", slug: "delight", count: 45 },
  { id: "2", name: "DOW FilmTec", slug: "dow-filmtec", count: 12 },
  { id: "3", name: "Pentair", slug: "pentair", count: 8 },
  { id: "4", name: "Grundfos", slug: "grundfos", count: 5 },
  { id: "5", name: "Cuckoo", slug: "cuckoo", count: 3 },
];

const mockTags: TagItem[] = [
  { id: "1", name: "Best Seller", slug: "best-seller", color: "#f57224", count: 15 },
  { id: "2", name: "New Arrival", slug: "new-arrival", color: "#10b981", count: 8 },
  { id: "3", name: "Free Installation", slug: "free-installation", color: "#3fc6ff", count: 12 },
  { id: "4", name: "Warranty", slug: "warranty", color: "#8b5cf6", count: 20 },
  { id: "5", name: "Energy Efficient", slug: "energy-efficient", color: "#eab308", count: 10 },
  { id: "6", name: "Commercial", slug: "commercial", color: "#003b6f", count: 7 },
  { id: "7", name: "Domestic", slug: "domestic", color: "#059669", count: 18 },
  { id: "8", name: "Industrial", slug: "industrial", color: "#dc2626", count: 5 },
];

// ============= FILTER SECTION COMPONENT =============

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

// ============= MAIN FILTER COMPONENT =============

export function ProductFilters({
  filters,
  onFilterChange,
  maxPrice = 500000,
  className,
}: ProductFiltersProps) {
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() || "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() || "");

  // Category toggle
  const toggleCategory = (slug: string) => {
    const updated = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFilterChange({ ...filters, categories: updated });
  };

  // Brand toggle
  const toggleBrand = (slug: string) => {
    const updated = filters.brands.includes(slug)
      ? filters.brands.filter((b) => b !== slug)
      : [...filters.brands, slug];
    onFilterChange({ ...filters, brands: updated });
  };

  // Tag toggle
  const toggleTag = (slug: string) => {
    const updated = filters.tags.includes(slug)
      ? filters.tags.filter((t) => t !== slug)
      : [...filters.tags, slug];
    onFilterChange({ ...filters, tags: updated });
  };

  // Price range apply
  const applyPriceRange = () => {
    onFilterChange({
      ...filters,
      priceMin: priceMin ? parseInt(priceMin) : null,
      priceMax: priceMax ? parseInt(priceMax) : null,
    });
  };

  // Clear all filters
  const clearAll = () => {
    setPriceMin("");
    setPriceMax("");
    onFilterChange({
      categories: [],
      brands: [],
      tags: [],
      priceMin: null,
      priceMax: null,
      rating: null,
      inStockOnly: false,
      sortBy: "newest",
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.tags.length +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className={cn("bg-white rounded-xl border border-[var(--color-border)]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[var(--color-aqua)]" />
          <h2 className="font-heading font-bold">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-[var(--color-aqua)]/10 text-[var(--color-primary)] text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <div className="p-4 space-y-0">
        {/* Categories */}
        <FilterSection title="Categories">
          <ul className="space-y-2">
            {mockCategories.map((cat) => (
              <li key={cat.id}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="rounded border-[var(--color-border)]"
                  />
                  <label className="flex-1 text-sm cursor-pointer flex items-center justify-between">
                    <span>{cat.name}</span>
                    <span className="text-xs text-[var(--color-muted-foreground)]">({cat.count})</span>
                  </label>
                </div>
                {/* Subcategories */}
                {cat.children && (
                  <ul className="ml-6 mt-1.5 space-y-1.5">
                    {cat.children.map((child) => (
                      <li key={child.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(child.slug)}
                          onChange={() => toggleCategory(child.slug)}
                          className="rounded border-[var(--color-border)]"
                        />
                        <label className="flex-1 text-xs cursor-pointer flex items-center justify-between">
                          <span className="text-[var(--color-muted-foreground)]">{child.name}</span>
                          <span className="text-[var(--color-muted-foreground)]">({child.count})</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands">
          <ul className="space-y-2">
            {mockBrands.map((brand) => (
              <li key={brand.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.slug)}
                  onChange={() => toggleBrand(brand.slug)}
                  className="rounded border-[var(--color-border)]"
                />
                <label className="flex-1 text-sm cursor-pointer flex items-center justify-between">
                  <span>{brand.name}</span>
                  <span className="text-xs text-[var(--color-muted-foreground)]">({brand.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Tags */}
        <FilterSection title="Tags">
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  filters.tags.includes(tag.slug)
                    ? "border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-aqua)]/50"
                )}
                style={
                  filters.tags.includes(tag.slug) && tag.color
                    ? { borderColor: tag.color, backgroundColor: `${tag.color}15`, color: tag.color }
                    : undefined
                }
              >
                {tag.name}
                <span className="ml-1 opacity-60">({tag.count})</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range (Rs)">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-[var(--color-muted-foreground)] mb-1">Min</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="0"
                  className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[var(--color-muted-foreground)] mb-1">Max</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder={formatPriceLKR(maxPrice).replace("Rs", "").trim()}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={applyPriceRange}
              className="w-full h-9 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90"
            >
              Apply Price
            </button>
            {/* Quick price ranges */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Under 5K", min: 0, max: 5000 },
                { label: "5K - 25K", min: 5000, max: 25000 },
                { label: "25K - 50K", min: 25000, max: 50000 },
                { label: "50K - 100K", min: 50000, max: 100000 },
                { label: "100K+", min: 100000, max: null },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setPriceMin(range.min.toString());
                    setPriceMax(range.max?.toString() || "");
                    onFilterChange({
                      ...filters,
                      priceMin: range.min,
                      priceMax: range.max,
                    });
                  }}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-colors",
                    filters.priceMin === range.min && filters.priceMax === range.max
                      ? "border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-aqua)]/50"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating">
          <ul className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <li key={rating} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => onFilterChange({ ...filters, rating })}
                  className="border-[var(--color-border)]"
                />
                <label className="flex items-center gap-1 cursor-pointer text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? "text-yellow-400" : "text-[var(--color-border)]"}>
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-[var(--color-muted-foreground)] ml-1">& up</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="rounded border-[var(--color-border)]"
            />
            <span className="text-sm">In Stock Only</span>
          </label>
        </FilterSection>
      </div>
    </div>
  );
}

// ============= ACTIVE FILTERS BAR =============

export function ActiveFiltersBar({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) {
  const activeFilters: { label: string; onRemove: () => void }[] = [];

  filters.categories.forEach((cat) => {
    activeFilters.push({
      label: `Category: ${cat}`,
      onRemove: () =>
        onFilterChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    });
  });

  filters.brands.forEach((brand) => {
    activeFilters.push({
      label: `Brand: ${brand}`,
      onRemove: () =>
        onFilterChange({
          ...filters,
          brands: filters.brands.filter((b) => b !== brand),
        }),
    });
  });

  filters.tags.forEach((tag) => {
    activeFilters.push({
      label: `Tag: ${tag}`,
      onRemove: () =>
        onFilterChange({
          ...filters,
          tags: filters.tags.filter((t) => t !== tag),
        }),
    });
  });

  if (filters.priceMin || filters.priceMax) {
    activeFilters.push({
      label: `Price: ${filters.priceMin ? formatPriceLKR(filters.priceMin) : "Rs 0"} - ${
        filters.priceMax ? formatPriceLKR(filters.priceMax) : "Any"
      }`,
      onRemove: () => onFilterChange({ ...filters, priceMin: null, priceMax: null }),
    });
  }

  if (filters.rating) {
    activeFilters.push({
      label: `Rating: ${filters.rating}+ stars`,
      onRemove: () => onFilterChange({ ...filters, rating: null }),
    });
  }

  if (filters.inStockOnly) {
    activeFilters.push({
      label: "In Stock Only",
      onRemove: () => onFilterChange({ ...filters, inStockOnly: false }),
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-[var(--color-muted-foreground)]">Active Filters:</span>
      {activeFilters.map((filter, i) => (
        <button
          key={i}
          onClick={filter.onRemove}
          className="flex items-center gap-1 px-3 py-1 bg-[var(--color-aqua)]/10 text-[var(--color-primary)] text-xs font-medium rounded-full hover:bg-[var(--color-aqua)]/20 transition-colors"
        >
          {filter.label}
          <X size={12} />
        </button>
      ))}
      <button
        onClick={() =>
          onFilterChange({
            categories: [],
            brands: [],
            tags: [],
            priceMin: null,
            priceMax: null,
            rating: null,
            inStockOnly: false,
            sortBy: filters.sortBy,
          })
        }
        className="text-xs text-red-500 hover:underline ml-2"
      >
        Clear All
      </button>
    </div>
  );
}

// ============= SORT & VIEW TOOLBAR =============

export function ProductToolbar({
  totalResults,
  filters,
  onFilterChange,
  onToggleMobileFilters,
}: {
  totalResults: number;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onToggleMobileFilters?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-white mb-4">
      <div className="flex items-center gap-3">
        {/* Mobile filter toggle */}
        {onToggleMobileFilters && (
          <button
            onClick={onToggleMobileFilters}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
          >
            <Filter size={16} />
            Filters
          </button>
        )}
        <p className="text-sm text-[var(--color-muted-foreground)]">
          <span className="font-medium text-[var(--color-foreground)]">{totalResults}</span> products found
        </p>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
