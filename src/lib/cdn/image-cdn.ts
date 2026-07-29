/**
 * Free Image CDN Service
 * 
 * Supports multiple free CDN providers:
 * 1. Cloudinary (Free tier: 25 credits/month, 25GB storage)
 * 2. Supabase Storage (Free tier: 1GB storage, 2GB bandwidth)
 * 3. Imgproxy (Self-hosted image processing)
 * 4. Unsplash Source (Free stock photos)
 * 5. Pexels API (Free stock photos)
 * 
 * Priority order: Cloudinary -> Supabase -> Fallback
 */

export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  crop?: "fill" | "fit" | "scale" | "thumb";
  gravity?: "auto" | "face" | "center" | "north" | "south";
  blur?: number;
  brightness?: number;
  opacity?: number;
  radius?: number | "max";
  effect?: "grayscale" | "blur" | "shadow" | "sepia" | "outline";
};

// ============= CLOUDINARY (Primary) =============

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "delight_water";

/**
 * Generate Cloudinary URL with transformations
 * Free: No limits on transformations, 25 credits/month
 */
export function getCloudinaryUrl(
  publicId: string,
  options: ImageTransformOptions = {}
): string {
  if (!CLOUDINARY_CLOUD_NAME || !publicId) return publicId;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    blur,
    effect,
    radius,
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (quality !== "auto") transforms.push(`q_${quality}`);
  else transforms.push("q_auto");
  if (format !== "auto") transforms.push(`f_${format}`);
  else transforms.push("f_auto");
  if (crop) transforms.push(`c_${crop}`);
  if (gravity && crop === "fill") transforms.push(`g_${gravity}`);
  if (blur) transforms.push(`e_blur:${blur}`);
  if (effect) transforms.push(`e_${effect}`);
  if (radius) transforms.push(`r_${radius === "max" ? "max" : radius}`);

  // Add DPR for retina displays
  transforms.push("dpr_auto");

  const transformStr = transforms.join(",");
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
}

/**
 * Generate Cloudinary upload signature for secure uploads
 */
export async function getCloudinaryUploadSignature(
  timestamp: number,
  folder: string = "delight-water-shop"
) {
  const crypto = await import("crypto");
  const params = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(params + CLOUDINARY_API_SECRET)
    .digest("hex");

  return { signature, timestamp, apiKey: CLOUDINARY_API_KEY };
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUDINARY_CLOUD_NAME);
}

// ============= SUPABASE STORAGE (Fallback) =============

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Get Supabase Storage public URL
 * Free tier: 1GB storage, 2GB bandwidth/month
 */
export function getSupabaseStorageUrl(
  bucket: string,
  path: string,
  options: ImageTransformOptions = {}
): string {
  if (!SUPABASE_URL || !path) return path;

  const { width, height, quality = 80, format = "webp" } = options;

  // Supabase doesn't have built-in image transforms
  // We'll use the raw URL and handle transforms client-side or via proxy
  const baseUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;

  // For transforms, we'd need a proxy or client-side processing
  if (width || height) {
    // Use Next.js Image optimization as fallback
    return baseUrl;
  }

  return baseUrl;
}

/**
 * Generate Supabase Storage signed URL for private files
 */
export async function getSupabaseSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

/**
 * Get Supabase upload URL
 */
export function getSupabaseUploadUrl(bucket: string): string {
  return `${SUPABASE_URL}/storage/v1/object/${bucket}`;
}

// ============= FREE IMAGE SOURCES =============

/**
 * Get a placeholder image from various free sources
 */
export function getPlaceholderImage(
  width: number = 600,
  height: number = 600,
  text: string = "Delight Water",
  bgColor: string = "003b6f",
  textColor: string = "ffffff"
): string {
  // Using placehold.co - free, no API key needed
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}&font=poppins`;
}

/**
 * Get Unsplash image (free stock photos, no API key for Source)
 */
export function getUnsplashImage(
  query: string = "water",
  width: number = 600,
  height: number = 600
): string {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
}

// ============= UNIFIED IMAGE SERVICE =============

export type ImageSource = "cloudinary" | "supabase" | "external" | "placeholder";

export interface ImageResult {
  url: string;
  blurDataUrl?: string;
  source: ImageSource;
  width?: number;
  height?: number;
}

/**
 * Get optimized image URL from any source
 * Automatically selects best CDN based on configuration
 */
export function getOptimizedImageUrl(
  source: string,
  options: ImageTransformOptions = {}
): ImageResult {
  // Already a Cloudinary URL
  if (source.includes("cloudinary.com")) {
    const publicId = source.split("/upload/")[1]?.replace(/\.[^.]+$/, "") || source;
    return {
      url: getCloudinaryUrl(publicId, options),
      source: "cloudinary",
    };
  }

  // Supabase Storage URL
  if (source.includes("supabase.co/storage")) {
    return {
      url: getSupabaseStorageUrl("products", source.split("/public/")[1] || "", options),
      source: "supabase",
    };
  }

  // External URL (pass through with Next.js optimization)
  if (source.startsWith("http")) {
    return {
      url: source,
      source: "external",
    };
  }

  // Placeholder
  return {
    url: getPlaceholderImage(
      options.width || 600,
      options.height || 600,
      "Delight Water",
      "003b6f",
      "ffffff"
    ),
    source: "placeholder",
  };
}

/**
 * Generate blur placeholder data URL for Next.js Image
 */
export function generateBlurPlaceholder(
  width: number = 20,
  height: number = 20
): string {
  // SVG blur placeholder
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <filter id="b"><feGaussianBlur stdDeviation="2"/></filter>
      <rect width="100%" height="100%" filter="url(#b)" fill="#3fc6ff" opacity="0.3"/>
    </svg>`
  ).toString("base64")}`;
}

/**
 * Generate all responsive sizes for an image
 */
export function getResponsiveImageSizes(
  source: string,
  baseWidth: number = 600
): Record<string, string> {
  const sizes = [200, 400, 600, 800, 1000, 1200];
  const result: Record<string, string> = {};

  for (const size of sizes) {
    const { url } = getOptimizedImageUrl(source, {
      width: size,
      height: size,
      quality: 80,
    });
    result[`${size}w`] = url;
  }

  return result;
}

// ============= UPLOAD HELPERS =============

export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedDocumentTypes: ["application/pdf", "application/msword"],
  maxImageDimensions: { width: 4096, height: 4096 },
  quality: 80,
  outputFormat: "webp" as const,
};

export const BUCKET_CONFIG = {
  products: "products",
  categories: "categories",
  brands: "brands",
  reviews: "reviews",
  users: "users",
  banners: "banners",
  temp: "temp",
};

/**
 * Validate uploaded file
 */
export function validateUpload(file: {
  size: number;
  type: string;
  name: string;
}): { valid: boolean; error?: string } {
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: "File too large (max 5MB)" };
  }

  const allAllowed = [
    ...UPLOAD_CONFIG.allowedImageTypes,
    ...UPLOAD_CONFIG.allowedDocumentTypes,
  ];

  if (!allAllowed.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Check for suspicious extensions
  const dangerousExtensions = [".exe", ".bat", ".cmd", ".sh", ".php", ".js"];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (dangerousExtensions.includes(ext)) {
    return { valid: false, error: "Suspicious file extension" };
  }

  return { valid: true };
}

/**
 * Generate unique filename for upload
 */
export function generateUploadFilename(
  originalName: string,
  folder: string
): string {
  const ext = originalName.slice(originalName.lastIndexOf("."));
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedName = originalName
    .slice(0, originalName.lastIndexOf("."))
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 50);

  return `${folder}/${sanitizedName}-${timestamp}-${random}${ext}`;
}
