"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, Check, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockBrands = [
  { id: "1", name: "Delight", slug: "delight", logo: null, productCount: 45, isActive: true },
  { id: "2", name: "DOW FilmTec", slug: "dow-filmtec", logo: null, productCount: 12, isActive: true },
  { id: "3", name: "Pentair", slug: "pentair", logo: null, productCount: 8, isActive: true },
  { id: "4", name: "Grundfos", slug: "grundfos", logo: null, productCount: 5, isActive: true },
  { id: "5", name: "Cuckoo", slug: "cuckoo", logo: null, productCount: 3, isActive: false },
];

const mockCategories = [
  { id: "1", name: "RO Water Purifiers", slug: "ro-water-purifiers", productCount: 25, isActive: true, children: 3 },
  { id: "2", name: "Water Filters", slug: "water-filters", productCount: 15, isActive: true, children: 4 },
  { id: "3", name: "Spare Parts", slug: "spare-parts", productCount: 30, isActive: true, children: 5 },
  { id: "4", name: "Chemicals & Consumables", slug: "chemicals-consumables", productCount: 18, isActive: true, children: 3 },
  { id: "5", name: "Accessories", slug: "accessories", productCount: 12, isActive: true, children: 2 },
];

const mockTags = [
  { id: "1", name: "Best Seller", slug: "best-seller", color: "#f57224", productCount: 15, isActive: true },
  { id: "2", name: "New Arrival", slug: "new-arrival", color: "#10b981", productCount: 8, isActive: true },
  { id: "3", name: "Free Installation", slug: "free-installation", color: "#3fc6ff", productCount: 12, isActive: true },
  { id: "4", name: "Warranty", slug: "warranty", color: "#8b5cf6", productCount: 20, isActive: true },
  { id: "5", name: "Energy Efficient", slug: "energy-efficient", color: "#eab308", productCount: 10, isActive: true },
  { id: "6", name: "Commercial", slug: "commercial", color: "#003b6f", productCount: 7, isActive: true },
  { id: "7", name: "Domestic", slug: "domestic", color: "#059669", productCount: 18, isActive: true },
  { id: "8", name: "Industrial", slug: "industrial", color: "#dc2626", productCount: 5, isActive: true },
  { id: "9", name: "Clearance", slug: "clearance", color: "#ef4444", productCount: 3, isActive: false },
];

export default function AdminTaxonomyPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "brands" | "tags">("categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categories, Brands & Tags</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Manage your product taxonomy and organization
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 ocean-gradient text-white font-medium rounded-xl hover:opacity-90"
        >
          <Plus size={18} />
          Add {activeTab === "categories" ? "Category" : activeTab === "brands" ? "Brand" : "Tag"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {(["categories", "brands", "tags"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors",
              activeTab === tab
                ? "border-[var(--color-aqua)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            )}
          >
            {tab}
            <span className="ml-2 px-1.5 py-0.5 bg-[var(--color-muted)] text-xs rounded">
              {tab === "categories" ? mockCategories.length : tab === "brands" ? mockBrands.length : mockTags.length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
        />
      </div>

      {/* Content */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Subcategories</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Products</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockCategories
                .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((cat) => (
                  <tr key={cat.id} className="hover:bg-[var(--color-muted)]/50">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">/{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-sm">{cat.children}</td>
                    <td className="px-4 py-3 text-center text-sm">{cat.productCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-[var(--color-muted)]">
                          <Edit size={14} className="text-[var(--color-muted-foreground)]" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "brands" && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Products</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockBrands
                .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((brand) => (
                  <tr key={brand.id} className="hover:bg-[var(--color-muted)]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                          {brand.logo ? (
                            <ImageIcon size={16} />
                          ) : (
                            <span className="text-xs font-bold">{brand.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-medium">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">/{brand.slug}</td>
                    <td className="px-4 py-3 text-center text-sm">{brand.productCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        brand.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-[var(--color-muted)]">
                          <Edit size={14} className="text-[var(--color-muted-foreground)]" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "tags" && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Products</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockTags
                .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((tag) => (
                  <tr key={tag.id} className="hover:bg-[var(--color-muted)]/50">
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">/{tag.slug}</td>
                    <td className="px-4 py-3 text-center text-sm">{tag.productCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        tag.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {tag.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-[var(--color-muted)]">
                          <Edit size={14} className="text-[var(--color-muted-foreground)]" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">
                Add {activeTab === "categories" ? "Category" : activeTab === "brands" ? "Brand" : "Tag"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-[var(--color-muted)]">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                  type="text"
                  placeholder={activeTab === "categories" ? "e.g., Domestic RO Plants" : activeTab === "brands" ? "e.g., Pentair" : "e.g., Best Seller"}
                  className="w-full h-10 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
              {activeTab === "tags" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Color</label>
                  <div className="flex gap-2">
                    {["#f57224", "#10b981", "#3fc6ff", "#8b5cf6", "#eab308", "#003b6f", "#dc2626", "#059669"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-transparent hover:border-[var(--color-foreground)] transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-muted)]"
                >
                  Cancel
                </button>
                <button className="flex-1 h-10 ocean-gradient text-white rounded-lg font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <Check size={16} /> Save
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
