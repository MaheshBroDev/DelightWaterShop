/**
 * Supabase Storage Service
 * 
 * Free tier: 1GB storage, 2GB bandwidth/month
 * 
 * Buckets:
 * - products: Product images (public)
 * - categories: Category images (public)
 * - brands: Brand logos (public)
 * - banners: Hero banners (public)
 * - reviews: Customer review images (public)
 * - users: User avatars (private)
 * - documents: Invoices, receipts (private)
 * - temp: Temporary uploads (auto-cleanup)
 * - animations: GIF animations (public)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============= SUPABASE CLIENT =============

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Supabase credentials not configured");
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error("Supabase admin credentials not configured");
    }
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }
  return supabaseAdmin;
}

// ============= BUCKET CONFIGURATION =============

export const STORAGE_BUCKETS = {
  products: {
    name: "products",
    public: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    folderStructure: "/products/{category}/{productId}/",
  },
  categories: {
    name: "categories",
    public: true,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    folderStructure: "/categories/",
  },
  brands: {
    name: "brands",
    public: true,
    maxFileSize: 1 * 1024 * 1024, // 1MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/svg+xml"],
    folderStructure: "/brands/",
  },
  banners: {
    name: "banners",
    public: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    folderStructure: "/banners/",
  },
  reviews: {
    name: "reviews",
    public: true,
    maxFileSize: 3 * 1024 * 1024, // 3MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    folderStructure: "/reviews/{userId}/",
  },
  users: {
    name: "users",
    public: false,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    folderStructure: "/users/{userId}/",
  },
  documents: {
    name: "documents",
    public: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    folderStructure: "/documents/{orderId}/",
  },
  animations: {
    name: "animations",
    public: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/gif", "video/mp4", "image/webp"],
    folderStructure: "/animations/",
  },
  temp: {
    name: "temp",
    public: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    folderStructure: "/temp/{sessionId}/",
    autoCleanup: true,
  },
};

export type BucketName = keyof typeof STORAGE_BUCKETS;

// ============= FILE OPERATIONS =============

export interface UploadOptions {
  bucket: BucketName;
  folder?: string;
  fileName?: string;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface UploadResult {
  url: string;
  publicUrl?: string;
  path: string;
  bucket: string;
  size: number;
  mimeType: string;
}

/**
 * Validate file before upload
 */
function validateFile(
  file: { size: number; type: string; name: string },
  bucket: BucketName
): { valid: boolean; error?: string } {
  const config = STORAGE_BUCKETS[bucket];

  // Check file size
  if (file.size > config.maxFileSize) {
    const maxSizeMB = config.maxFileSize / (1024 * 1024);
    return { valid: false, error: `File too large. Maximum size is ${maxSizeMB}MB` };
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${config.allowedMimeTypes.join(", ")}`,
    };
  }

  // Check for dangerous extensions
  const dangerousExtensions = [".exe", ".bat", ".cmd", ".sh", ".php", ".html", ".js"];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (dangerousExtensions.includes(ext)) {
    return { valid: false, error: "Suspicious file type detected" };
  }

  // Check for empty file
  if (file.size === 0) {
    return { valid: false, error: "Cannot upload empty file" };
  }

  return { valid: true };
}

/**
 * Generate unique file path
 */
function generateFilePath(
  originalName: string,
  bucket: BucketName,
  folder?: string,
  customFileName?: string
): string {
  const ext = originalName.slice(originalName.lastIndexOf("."));
  const baseName = customFileName || originalName
    .slice(0, originalName.lastIndexOf("."))
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 50);

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileName = `${baseName}-${timestamp}-${random}${ext}`;

  const bucketFolder = folder || bucket;
  return `${bucketFolder}/${fileName}`;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  // Validate file
  const validation = validateFile(file, options.bucket);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabaseClient = getSupabase();
  const path = generateFilePath(
    file.name,
    options.bucket,
    options.folder,
    options.fileName
  );

  const { data, error } = await supabaseClient.storage
    .from(options.bucket)
    .upload(path, file, {
      contentType: options.contentType || file.type,
      cacheControl: options.cacheControl || "3600",
      upsert: options.upsert || false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL if bucket is public
  let publicUrl: string | undefined;
  const bucketConfig = STORAGE_BUCKETS[options.bucket];

  if (bucketConfig.public) {
    const { data: urlData } = supabaseClient.storage
      .from(options.bucket)
      .getPublicUrl(data.path);
    publicUrl = urlData.publicUrl;
  }

  return {
    url: publicUrl || data.path,
    publicUrl,
    path: data.path,
    bucket: options.bucket,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const results = await Promise.allSettled(
    files.map((file) => uploadFile(file, options))
  );

  const successful: UploadResult[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successful.push(result.value);
    } else {
      errors.push(`File ${index + 1}: ${result.reason.message}`);
    }
  });

  if (errors.length > 0) {
    console.warn("Some uploads failed:", errors);
  }

  return successful;
}

/**
 * Get signed URL for private files
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const supabaseClient = getSupabase();

  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<void> {
  const supabaseClient = getSupabase();

  const { error } = await supabaseClient.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Delete multiple files
 */
export async function deleteMultipleFiles(
  bucket: BucketName,
  paths: string[]
): Promise<void> {
  const supabaseClient = getSupabase();

  const { error } = await supabaseClient.storage
    .from(bucket)
    .remove(paths);

  if (error) {
    throw new Error(`Failed to delete files: ${error.message}`);
  }
}

/**
 * List files in a folder
 */
export async function listFiles(
  bucket: BucketName,
  folder: string,
  limit: number = 100
): Promise<Array<{ name: string; id: string; updatedAt: string }>> {
  const supabaseClient = getSupabase();

  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .list(folder, {
      limit,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data.map((file) => ({
    name: file.name,
    id: file.id || "",
    updatedAt: file.updated_at || new Date().toISOString(),
  }));
}

/**
 * Get file metadata
 */
export async function getFileMetadata(
  bucket: BucketName,
  path: string
): Promise<{ size: number; mimeType: string; lastModified: string }> {
  const supabaseClient = getSupabase();

  // Download file info
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .info(path);

  if (error) {
    throw new Error(`Failed to get file info: ${error.message}`);
  }

  return {
    size: data.metadata?.size || 0,
    mimeType: data.metadata?.mimetype || "application/octet-stream",
    lastModified: data.metadata?.last_modified || new Date().toISOString(),
  };
}

/**
 * Copy file within storage
 */
export async function copyFile(
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<void> {
  const supabaseClient = getSupabase();

  const { error } = await supabaseClient.storage
    .from(bucket)
    .copy(fromPath, toPath);

  if (error) {
    throw new Error(`Failed to copy file: ${error.message}`);
  }
}

/**
 * Move file within storage
 */
export async function moveFile(
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<void> {
  const supabaseClient = getSupabase();

  const { error } = await supabaseClient.storage
    .from(bucket)
    .move(fromPath, toPath);

  if (error) {
    throw new Error(`Failed to move file: ${error.message}`);
  }
}

// ============= IMAGE PROCESSING HELPERS =============

/**
 * Get public URL for image with resize parameters
 * Note: Supabase doesn't do server-side transforms
 * Use Next.js Image optimization or CDN transforms
 */
export function getImageUrl(
  bucket: BucketName,
  path: string,
  options?: { width?: number; height?: number }
): string {
  const supabaseClient = getSupabase();

  const { data } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(path);

  // Return base URL - Next.js Image will handle optimization
  return data.publicUrl;
}

/**
 * Create image thumbnail (requires client-side processing)
 */
export async function createThumbnail(
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate dimensions maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create thumbnail"));
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

// ============= STORAGE QUOTA MONITORING =============

export interface StorageQuota {
  used: number;
  total: number;
  percentage: number;
  bandwidth: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * Get current storage usage (requires admin key)
 */
export async function getStorageUsage(): Promise<StorageQuota | null> {
  // Supabase free tier limits
  const TOTAL_STORAGE = 1 * 1024 * 1024 * 1024; // 1GB
  const TOTAL_BANDWIDTH = 2 * 1024 * 1024 * 1024; // 2GB/month

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get total size across all buckets
    const buckets = Object.keys(STORAGE_BUCKETS) as BucketName[];
    let totalSize = 0;

    for (const bucket of buckets) {
      try {
        const files = await listFiles(bucket, "", 1000);
        // Note: listFiles doesn't return size, would need individual file info
        // This is a simplified version
      } catch {
        // Skip buckets that don't exist yet
      }
    }

    return {
      used: totalSize,
      total: TOTAL_STORAGE,
      percentage: (totalSize / TOTAL_STORAGE) * 100,
      bandwidth: {
        used: 0, // Would need Supabase API to get actual bandwidth
        total: TOTAL_BANDWIDTH,
        percentage: 0,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Check if storage quota is approaching limit
 */
export function isStorageQuotaWarning(quota: StorageQuota): boolean {
  return quota.percentage > 80 || quota.bandwidth.percentage > 80;
}
