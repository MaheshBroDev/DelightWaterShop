/**
 * Google Drive Storage Integration
 * 
 * Free tier: 15GB shared across Google services
 * 
 * Use cases:
 * - Large file storage (videos, PDFs, documents)
 * - Backup of important assets
 * - Sharing files with team
 * - Customer document uploads (invoices, receipts)
 * 
 * Setup:
 * 1. Create Google Cloud Project
 * 2. Enable Google Drive API
 * 3. Create Service Account
 * 4. Download JSON credentials
 * 5. Share a folder with the service account email
 * 6. Set environment variables
 */

// ============= TYPES =============

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink?: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  parents?: string[];
}

export interface GoogleDriveUploadResult {
  fileId: string;
  fileName: string;
  webViewLink: string;
  webContentLink: string;
  size: number;
  mimeType: string;
}

// ============= CONFIGURATION =============

const GOOGLE_DRIVE_CREDENTIALS = process.env.GOOGLE_DRIVE_CREDENTIALS || "";
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
const GOOGLE_DRIVE_ACCESS_TOKEN = process.env.GOOGLE_DRIVE_ACCESS_TOKEN || "";

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3";

// ============= AUTHENTICATION =============

/**
 * Get access token for Google Drive API
 * Note: For production, use proper OAuth2 flow or service account
 * This is a simplified version for demonstration
 */
async function getAccessToken(): Promise<string> {
  if (GOOGLE_DRIVE_ACCESS_TOKEN) {
    return GOOGLE_DRIVE_ACCESS_TOKEN;
  }

  // In production, you would:
  // 1. Use service account credentials
  // 2. Or implement OAuth2 flow
  // 3. Or use Google's client library
  
  throw new Error(
    "Google Drive not configured. Set GOOGLE_DRIVE_ACCESS_TOKEN or implement OAuth2 flow."
  );
}

/**
 * Check if Google Drive is configured
 */
export function isGoogleDriveConfigured(): boolean {
  return Boolean(GOOGLE_DRIVE_FOLDER_ID && (GOOGLE_DRIVE_ACCESS_TOKEN || GOOGLE_DRIVE_CREDENTIALS));
}

// ============= FILE OPERATIONS =============

/**
 * Upload file to Google Drive
 */
export async function uploadToGoogleDrive(
  file: File | Blob,
  options: {
    fileName: string;
    folderId?: string;
    mimeType?: string;
    description?: string;
    makePublic?: boolean;
  }
): Promise<GoogleDriveUploadResult> {
  const token = await getAccessToken();
  const folderId = options.folderId || GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("Google Drive folder ID not configured");
  }

  // Prepare metadata
  const metadata = {
    name: options.fileName,
    parents: [folderId],
    description: options.description || "",
  };

  // Create multipart form data
  const boundary = "-------delight_water_shop_boundary";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${options.mimeType || file.type}\r\n\r\n` +
    // Note: In actual implementation, you'd need to read file as ArrayBuffer
    // This is simplified for demonstration
    closeDelimiter;

  // Upload file
  const response = await fetch(
    `${DRIVE_UPLOAD_URL}/files?uploadType=multipart`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: body,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google Drive upload failed: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();

  // Make file public if requested
  if (options.makePublic) {
    await makeFilePublic(data.id, token);
  }

  return {
    fileId: data.id,
    fileName: data.name,
    webViewLink: data.webViewLink,
    webContentLink: data.webContentLink,
    size: parseInt(data.size) || 0,
    mimeType: data.mimeType,
  };
}

/**
 * Create folder in Google Drive
 */
export async function createFolder(
  name: string,
  parentId?: string
): Promise<GoogleDriveFolder> {
  const token = await getAccessToken();

  const metadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentId ? [parentId || GOOGLE_DRIVE_FOLDER_ID] : undefined,
  };

  const response = await fetch(`${DRIVE_API_BASE}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create folder: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    parents: data.parents,
  };
}

/**
 * List files in a folder
 */
export async function listFilesInFolder(
  folderId?: string,
  pageSize: number = 100,
  pageToken?: string
): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> {
  const token = await getAccessToken();
  const targetFolderId = folderId || GOOGLE_DRIVE_FOLDER_ID;

  const params = new URLSearchParams({
    q: `'${targetFolderId}' in parents and trashed = false`,
    pageSize: pageSize.toString(),
    fields: "files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink),nextPageToken",
    orderBy: "createdTime desc",
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await fetch(`${DRIVE_API_BASE}/files?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to list files: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();

  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Get file by ID
 */
export async function getFileById(fileId: string): Promise<GoogleDriveFile> {
  const token = await getAccessToken();

  const response = await fetch(
    `${DRIVE_API_BASE}/files/${fileId}?fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get file: ${error.error?.message || "Unknown error"}`);
  }

  return response.json();
}

/**
 * Delete file from Google Drive
 */
export async function deleteFileFromDrive(fileId: string): Promise<void> {
  const token = await getAccessToken();

  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete file: ${error.error?.message || "Unknown error"}`);
  }
}

/**
 * Make file publicly accessible
 */
async function makeFilePublic(fileId: string, token: string): Promise<void> {
  const permission = {
    role: "reader",
    type: "anyone",
  };

  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permission),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to make file public:", error);
  }
}

/**
 * Search files in Google Drive
 */
export async function searchFiles(
  query: string,
  folderId?: string
): Promise<GoogleDriveFile[]> {
  const token = await getAccessToken();
  const targetFolderId = folderId || GOOGLE_DRIVE_FOLDER_ID;

  const params = new URLSearchParams({
    q: `name contains '${query}' and '${targetFolderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink)",
    pageSize: "50",
  });

  const response = await fetch(`${DRIVE_API_BASE}/files?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to search files: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Get download URL for file
 */
export function getDownloadUrl(fileId: string): string {
  return `${DRIVE_API_BASE}/files/${fileId}?alt=media`;
}

/**
 * Get storage usage
 */
export async function getDriveStorageUsage(): Promise<{
  used: string;
  limit: string;
  percentage: number;
}> {
  const token = await getAccessToken();

  const response = await fetch(`${DRIVE_API_BASE}/about?fields=storageQuota`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get storage usage: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();
  const quota = data.storageQuota;

  const used = parseInt(quota.usage || "0");
  const limit = parseInt(quota.limit || "16106127360"); // 15GB default

  return {
    used: quota.usageInDrive,
    limit: quota.limit,
    percentage: (used / limit) * 100,
  };
}

// ============= FOLDER STRUCTURE =============

/**
 * Create organized folder structure for Delight Water Shop
 */
export async function createShopFolderStructure(): Promise<void> {
  const folders = [
    { name: "products", description: "Product images and media" },
    { name: "categories", description: "Category images" },
    { name: "banners", description: "Hero banners and marketing" },
    { name: "documents", description: "Invoices, receipts, legal docs" },
    { name: "customer-uploads", description: "Customer uploaded files" },
    { name: "backups", description: "System backups" },
    { name: "videos", description: "Product videos and tutorials" },
    { name: "archive", description: "Old files and archives" },
  ];

  for (const folder of folders) {
    try {
      await createFolder(folder.name);
      console.log(`Created folder: ${folder.name}`);
    } catch (error) {
      console.error(`Failed to create folder ${folder.name}:`, error);
    }
  }
}

// ============= UTILITY FUNCTIONS =============

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number | string): string {
  const size = typeof bytes === "string" ? parseInt(bytes) : bytes;

  if (size === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));

  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "video/mp4": "mp4",
    "application/zip": "zip",
  };

  return mimeToExt[mimeType] || "bin";
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is a video
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Check if file is a document
 */
export function isDocumentFile(mimeType: string): boolean {
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  return documentTypes.includes(mimeType);
}
