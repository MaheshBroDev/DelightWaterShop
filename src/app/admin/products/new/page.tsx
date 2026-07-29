"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  X,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Layers,
  Search as SearchIcon,
  Globe,
  FileText,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProductStatus,
  getStatusDisplayName,
  AdminRole,
  hasPermission,
  AdminPermission,
} from "@/lib/admin/permissions";

const CATEGORIES = [
  { id: "1", name: "Domestic RO Plants", slug: "domestic-ro-plants" },
  { id: "2", name: "Commercial RO Plants", slug: "commercial-ro-plants" },
  { id: "3", name: "Industrial RO Plants", slug: "industrial-ro-plants" },
  { id: "4", name: "Spare Parts", slug: "spare-parts" },
  { id: "5", name: "Chemicals & Consumables", slug: "chemicals-consumables" },
  { id: "6", name: "Accessories", slug: "accessories" },
];

const BRANDS = [
  { id: "1", name: "Delight" },
  { id: "2", name: "DOW FilmTec" },
  { id: "3", name: "Pentair" },
  { id: "4", name: "Grundfos" },
  { id: "5", name: "Generic" },
];

const PRODUCT_TYPES = [
  { value: "SIMPLE", label: "Simple Product", description: "Single SKU, one price" },
  { value: "VARIABLE", label: "Variable Product", description: "Multiple variants (size, color)" },
  { value: "COMPOSITE", label: "Composite/Bundle", description: "Build-your-kit system" },
  { value: "BULK", label: "Bulk Pricing", description: "Tiered quantity pricing" },
];

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user role
  const userRole = AdminRole.SUPER_ADMIN;

  // Form state
  const [activeTab, setActiveTab] = useState("basic");
  const [productData, setProductData] = useState({
    // Basic info
    name: "",
    slug: "",
    description: "",
    sku: "",
    type: "SIMPLE",
    categoryId: "",
    brandId: "",
    basePrice: "",
    compareAtPrice: "",
    weight: "",
    status: ProductStatus.DRAFT,
    isFeatured: false,

    // SEO
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    canonicalUrl: "",

    // Images
    images: [] as string[],
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleInputChange = (field: string, value: any) => {
    setProductData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === "name" && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // In production, upload to Supabase Storage or Cloudinary
      // For now, create object URLs for preview
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));

      setUploadedImages((prev) => [...prev, ...newImages.map((img) => img.url)]);
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages.map((img) => img.url)],
      }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Save product
  const handleSave = async (status: ProductStatus) => {
    setIsSaving(true);

    try {
      // API call to save product
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          status,
          basePrice: parseFloat(productData.basePrice) || 0,
          compareAtPrice: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
          weight: productData.weight ? parseFloat(productData.weight) : null,
          seoKeywords: productData.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");

      const data = await response.json();
      router.push(`/admin/products/${data.id}`);
    } catch (error) {
      console.error("Save error:", error);
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  // Submit for review
  const handleSubmitForReview = () => {
    handleSave(ProductStatus.PENDING_REVIEW);
  };

  // Publish (only if has permission)
  const handlePublish = () => {
    if (hasPermission(userRole, AdminPermission.PRODUCTS_PUBLISH)) {
      handleSave(ProductStatus.PUBLISHED);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing & Inventory", icon: DollarSign },
    { id: "variants", label: "Variants", icon: Layers },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-[var(--color-muted)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold">Add New Product</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Create a new product listing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(ProductStatus.DRAFT)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)] disabled:opacity-50"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={handleSubmitForReview}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <Send size={16} />
            Submit for Review
          </button>
          {hasPermission(userRole, AdminPermission.PRODUCTS_PUBLISH) && (
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Check size={16} />
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[var(--color-aqua)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Delight Domestic RO Water Purifier"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-muted-foreground)]">/products/</span>
                  <input
                    type="text"
                    value={productData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="product-slug"
                    className="flex-1 h-10 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Product Type *</label>
                <select
                  value={productData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                >
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">SKU *</label>
                <input
                  type="text"
                  value={productData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="e.g., DEL-RO-DOM-100"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Category *</label>
                <select
                  value={productData.categoryId}
                  onChange={(e) => handleInputChange("categoryId", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Brand</label>
                <select
                  value={productData.brandId}
                  onChange={(e) => handleInputChange("brandId", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                >
                  <option value="">Select brand</option>
                  {BRANDS.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your product..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productData.isFeatured}
                  onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-border)]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium">
                  Featured Product
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Inventory Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Base Price (Rs) *</label>
                <input
                  type="number"
                  value={productData.basePrice}
                  onChange={(e) => handleInputChange("basePrice", e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Compare at Price (Rs)</label>
                <input
                  type="number"
                  value={productData.compareAtPrice}
                  onChange={(e) => handleInputChange("compareAtPrice", e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  Original price before discount
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  value={productData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
            </div>

            {/* Bulk pricing for BULK type */}
            {productData.type === "BULK" && (
              <div>
                <h3 className="font-medium mb-3">Bulk Pricing Tiers</h3>
                <div className="space-y-2">
                  {[
                    { minQty: 1, price: productData.basePrice },
                    { minQty: 10, price: "" },
                    { minQty: 25, price: "" },
                    { minQty: 50, price: "" },
                  ].map((tier, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm w-24">Min {tier.minQty} units:</span>
                      <input
                        type="number"
                        placeholder={i === 0 ? productData.basePrice || "0" : "0.00"}
                        className="flex-1 h-9 px-3 rounded-lg border border-[var(--color-border)] text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === "variants" && (
          <div className="space-y-6">
            {productData.type === "VARIABLE" ? (
              <div>
                <h3 className="font-medium mb-3">Product Variants</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Add options like size, color, capacity, etc.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Option Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Size, Color, Capacity"
                      className="w-full h-10 px-4 rounded-lg border border-[var(--color-border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Option Values</label>
                    <input
                      type="text"
                      placeholder="Comma-separated: 75 GPD, 100 GPD, 150 GPD"
                      className="w-full h-10 px-4 rounded-lg border border-[var(--color-border)]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Layers size={48} className="mx-auto text-[var(--color-muted-foreground)]/30 mb-4" />
                <p className="text-[var(--color-muted-foreground)]">
                  Variants are only available for Variable products.
                  <br />
                  Change the product type in Basic Info tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Product Images</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                Upload high-quality images. First image will be the main product image.
              </p>

              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-aqua)] transition-colors"
              >
                {isUploading ? (
                  <div className="animate-pulse">
                    <Upload size={40} className="mx-auto text-[var(--color-muted-foreground)] mb-2" />
                    <p className="text-sm text-[var(--color-muted-foreground)]">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={40} className="mx-auto text-[var(--color-muted-foreground)]/50 mb-2" />
                    <p className="text-sm font-medium">Click to upload images</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                      PNG, JPG, WebP up to 5MB each
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image preview grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-[var(--color-border)]">
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded">
                          Main
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Search Engine Optimization</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                Optimize your product for search engines
              </p>
            </div>

            {/* SEO Preview */}
            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-2">Google Preview</p>
              <p className="text-blue-600 text-lg truncate">
                {productData.seoTitle || productData.name || "Product Title"} | Delight Water Shop
              </p>
              <p className="text-green-700 text-sm truncate">
                shop.delightwatersolutions.com/products/{productData.slug || "product-slug"}
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mt-1">
                {productData.seoDescription || productData.description || "Product description will appear here..."}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={productData.seoTitle}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  placeholder={productData.name || "Product title for search engines"}
                  maxLength={60}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {productData.seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                <textarea
                  value={productData.seoDescription}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  placeholder={productData.description || "Brief description for search results"}
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none resize-none"
                />
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {productData.seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Keywords</label>
                <input
                  type="text"
                  value={productData.seoKeywords}
                  onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
                  placeholder="Comma-separated: RO water purifier, water filter, Sri Lanka"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Canonical URL</label>
                <input
                  type="url"
                  value={productData.canonicalUrl}
                  onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                  placeholder="https://shop.delightwatersolutions.com/products/..."
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">OG Image URL</label>
                <input
                  type="url"
                  value={productData.ogImage}
                  onChange={(e) => handleInputChange("ogImage", e.target.value)}
                  placeholder="Image URL for social media sharing"
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] focus:border-[var(--color-aqua)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
