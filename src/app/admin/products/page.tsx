"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Clock,
  Package,
  FileEdit,
  ArrowUpDown,
} from "lucide-react";
import { cn, formatPriceLKR } from "@/lib/utils";
import {
  ProductStatus,
  getStatusDisplayName,
  getStatusColor,
  getAvailableTransitions,
  canTransitionStatus,
  AdminRole,
  AdminPermission,
} from "@/lib/admin/permissions";

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Delight Domestic RO Water Purifier",
    slug: "delight-domestic-ro-plant",
    sku: "DEL-RO-DOM",
    status: "PUBLISHED" as ProductStatus,
    basePrice: 32500,
    stock: 15,
    category: "Domestic RO Plants",
    images: ["https://placehold.co/100x100/003b6f/ffffff?text=RO"],
    updatedAt: "2024-01-15",
    updatedBy: "John Admin",
  },
  {
    id: "2",
    name: "Delight Commercial RO System 500 LPH",
    slug: "delight-commercial-ro-plant",
    sku: "DEL-RO-COM",
    status: "PENDING_REVIEW" as ProductStatus,
    basePrice: 85000,
    stock: 5,
    category: "Commercial RO Plants",
    images: ["https://placehold.co/100x100/00223d/3fc6ff?text=Commercial"],
    updatedAt: "2024-01-14",
    updatedBy: "Sarah Manager",
  },
  {
    id: "3",
    name: "PP Spun Filter 10 Inch",
    slug: "pp-spun-filter-10-inch",
    sku: "DEL-SPUN-10",
    status: "DRAFT" as ProductStatus,
    basePrice: 850,
    stock: 50,
    category: "Spare Parts",
    images: ["https://placehold.co/100x100/e2e8f0/003b6f?text=Filter"],
    updatedAt: "2024-01-13",
    updatedBy: "Mike Editor",
  },
  {
    id: "4",
    name: "RO Antiscalant Chemical 20kg",
    slug: "ro-antiscalant-chemical-20kg",
    sku: "DEL-ANT-20",
    status: "PUBLISHED" as ProductStatus,
    basePrice: 12500,
    stock: 20,
    category: "Chemicals",
    images: ["https://placehold.co/100x100/e2e8f0/003b6f?text=Chemical"],
    updatedAt: "2024-01-12",
    updatedBy: "John Admin",
  },
  {
    id: "5",
    name: "UV Sterilizer Lamp 11W",
    slug: "uv-sterilizer-lamp-11w",
    sku: "DEL-UV-11W",
    status: "UNPUBLISHED" as ProductStatus,
    basePrice: 4500,
    stock: 30,
    category: "Spare Parts",
    images: ["https://placehold.co/100x100/e2e8f0/003b6f?text=UV"],
    updatedAt: "2024-01-11",
    updatedBy: "John Admin",
  },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const userRole = AdminRole.SUPER_ADMIN; // Mock - get from session

  const filteredProducts = mockProducts.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && product.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const statusCounts: Record<string, number> = {
    all: mockProducts.length,
    [ProductStatus.DRAFT]: mockProducts.filter((p) => p.status === ProductStatus.DRAFT).length,
    [ProductStatus.PENDING_REVIEW]: mockProducts.filter((p) => p.status === ProductStatus.PENDING_REVIEW).length,
    [ProductStatus.PUBLISHED]: mockProducts.filter((p) => p.status === ProductStatus.PUBLISHED).length,
    [ProductStatus.UNPUBLISHED]: mockProducts.filter((p) => p.status === ProductStatus.UNPUBLISHED).length,
  };

  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    // API call to update status
    console.log(`Changing product ${productId} to ${newStatus}`);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Manage your product catalog, inventory, and listings
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 ocean-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { key: "all", label: "All Products", icon: Package },
          { key: ProductStatus.DRAFT, label: "Drafts", icon: FileEdit },
          { key: ProductStatus.PENDING_REVIEW, label: "Pending Review", icon: Clock },
          { key: ProductStatus.PUBLISHED, label: "Published", icon: Check },
          { key: ProductStatus.UNPUBLISHED, label: "Unpublished", icon: X },
        ].map((tab) => {
          const Icon = tab.icon;
          const count = tab.key === "all" ? statusCounts.all : statusCounts[tab.key as ProductStatus] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                statusFilter === tab.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              )}
            >
              <Icon size={16} />
              {tab.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs",
                statusFilter === tab.key ? "bg-white/20" : "bg-[var(--color-muted)]"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            placeholder="Search products by name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)]">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-[var(--color-border)]" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-[var(--color-foreground)]">
                    Product <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider hidden md:table-cell">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[var(--color-muted)]/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                        }
                      }}
                      className="rounded border-[var(--color-border)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] overflow-hidden shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-medium text-sm hover:text-[var(--color-primary)] line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          Updated {product.updatedAt} by {product.updatedBy}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)] hidden md:table-cell">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(product.status))}>
                      {getStatusDisplayName(product.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)] hidden lg:table-cell">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {formatPriceLKR(product.basePrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm hidden sm:table-cell">
                    <span className={cn(
                      "px-2 py-0.5 rounded",
                      product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-muted)]"
                      >
                        <MoreVertical size={16} className="text-[var(--color-muted-foreground)]" />
                      </button>
                      {openMenuId === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-10">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
                          >
                            <Edit size={14} /> Edit
                          </Link>
                          <Link
                            href={`/products/${product.slug}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
                            target="_blank"
                          >
                            <Eye size={14} /> View in Store
                          </Link>
                          {/* Status change options */}
                          {getAvailableTransitions(product.status, userRole).map((newStatus) => (
                            <button
                              key={newStatus}
                              onClick={() => handleStatusChange(product.id, newStatus)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
                            >
                              {newStatus === ProductStatus.PUBLISHED && <Check size={14} className="text-green-600" />}
                              {newStatus === ProductStatus.DRAFT && <X size={14} className="text-red-600" />}
                              {newStatus === ProductStatus.UNPUBLISHED && <X size={14} />}
                              Move to {getStatusDisplayName(newStatus)}
                            </button>
                          ))}
                          <div className="border-t border-[var(--color-border)]">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-[var(--color-muted-foreground)]/30 mb-4" />
            <p className="text-[var(--color-muted-foreground)]">No products found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Showing {filteredProducts.length} of {mockProducts.length} products
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)]">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
