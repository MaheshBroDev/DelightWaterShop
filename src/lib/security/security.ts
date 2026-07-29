/**
 * Comprehensive Security Module
 * 
 * Implements:
 * 1. CSRF Protection
 * 2. Rate Limiting
 * 3. Input Validation & Sanitization
 * 4. XSS Prevention
 * 5. SQL Injection Prevention (via Prisma)
 * 6. Content Security Policy headers
 * 7. Secure cookie handling
 * 8. API endpoint protection
 * 9. File upload security
 * 10. Authentication hardening
 * 11. Request logging & monitoring
 * 12. CORS configuration
 * 13. Helmet-style security headers
 * 14. Password security
 * 15. Session management
 */

import { NextRequest, NextResponse } from "next/server";

// Use Web Crypto API for Edge Runtime compatibility
const webCrypto = globalThis.crypto;

// ============= CSRF PROTECTION =============

const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "__csrf_token";

/**
 * Generate CSRF token (Edge-compatible)
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  webCrypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get(CSRF_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;

  if (!headerToken || !cookieToken) return false;
  return headerToken === cookieToken;
}

/**
 * Add CSRF token to response
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

// ============= RATE LIMITING =============

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter
 * In production, use Redis or similar
 */
export function rateLimit(
  key: string,
  options: {
    maxRequests: number;
    windowMs: number;
  } = { maxRequests: 100, windowMs: 60 * 1000 } // 100 requests per minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit by IP
 */
export function rateLimitByIP(
  request: NextRequest,
  options?: { maxRequests: number; windowMs: number }
) {
  const ip = request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return rateLimit(`ip:${ip}`, options);
}

/**
 * Rate limit by user
 */
export function rateLimitByUser(
  userId: string,
  options?: { maxRequests: number; windowMs: number }
) {
  return rateLimit(`user:${userId}`, options);
}

// Rate limit presets
export const RATE_LIMITS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },      // 5 per 15 min
  api: { maxRequests: 100, windowMs: 60 * 1000 },           // 100 per min
  upload: { maxRequests: 10, windowMs: 60 * 1000 },         // 10 per min
  search: { maxRequests: 30, windowMs: 60 * 1000 },         // 30 per min
  checkout: { maxRequests: 5, windowMs: 5 * 60 * 1000 },    // 5 per 5 min
  password: { maxRequests: 3, windowMs: 15 * 60 * 1000 },   // 3 per 15 min
};

// ============= INPUT VALIDATION =============

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitize HTML content (allow safe tags)
 */
export function sanitizeHTML(input: string): string {
  // Allow only safe tags
  const allowedTags = [
    "p", "br", "b", "i", "u", "strong", "em", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  ];

  // Remove all tags not in allowed list
  return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : "";
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Sri Lanka format)
 */
export function isValidSLPhone(phone: string): boolean {
  // +94 XX XXX XXXX or 0XX XXX XXXX
  const phoneRegex = /^(\+94|0)?[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters");
  } else {
    score += 1;
  }

  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Check for common patterns
  const commonPatterns = [
    "password", "123456", "qwerty", "admin", "letmein",
    "welcome", "monkey", "dragon", "master", "login",
  ];

  if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
    feedback.push("Avoid common passwords");
    score -= 2;
  }

  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push("Avoid repeating characters");
    score -= 1;
  }

  return {
    valid: score >= 4 && feedback.length === 0,
    score: Math.max(0, Math.min(6, score)),
    feedback,
  };
}

/**
 * Validate Sri Lankan NIC number
 */
export function isValidSLNIC(nic: string): boolean {
  // Old format: 9 digits + V/X
  // New format: 12 digits
  const oldFormat = /^\d{9}[VvXx]$/;
  const newFormat = /^\d{12}$/;
  return oldFormat.test(nic) || newFormat.test(nic);
}

// ============= SECURITY HEADERS =============

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://media.giphy.com https://source.unsplash.com https://placehold.co",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.giphy.com https://tenor.googleapis.com https://res.cloudinary.com",
      "frame-src 'self' https://www.payhere.lk https://sandbox.payhere.lk https://giphy.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // Other security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Remove server information
  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

// ============= AUTHENTICATION SECURITY =============

/**
 * Hash password with salt (Edge-compatible)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltArray = new Uint8Array(16);
  webCrypto.getRandomValues(saltArray);
  const salt = Array.from(saltArray, (b) => b.toString(16).padStart(2, "0")).join("");

  const encoder = new TextEncoder();
  const keyMaterial = await webCrypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await webCrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-512",
    },
    keyMaterial,
    512
  );

  const hash = Array.from(new Uint8Array(derivedBits), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash (Edge-compatible)
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");

  const encoder = new TextEncoder();
  const keyMaterial = await webCrypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await webCrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-512",
    },
    keyMaterial,
    512
  );

  const verifyHash = Array.from(new Uint8Array(derivedBits), (b) => b.toString(16).padStart(2, "0")).join("");
  return hash === verifyHash;
}

/**
 * Generate secure session token (Edge-compatible)
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(48);
  webCrypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Check if session is expired
 */
export function isSessionExpired(
  createdAt: Date,
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
): boolean {
  return Date.now() - createdAt.getTime() > maxAgeMs;
}

// ============= FILE UPLOAD SECURITY =============

export const UPLOAD_SECURITY = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "application/pdf",
  ],
  blockedExtensions: [
    ".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".html",
    ".htm", ".phtml", ".phar", ".py", ".pl", ".asp", ".aspx",
    ".jsp", ".cgi", ".swf", ".jar", ".msi", ".dll", ".com",
  ],
  maxFileNameLength: 100,
  maxFilesPerUpload: 10,
};

/**
 * Validate file upload
 */
export function validateFileUpload(file: {
  name: string;
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD_SECURITY.maxFileSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${UPLOAD_SECURITY.maxFileSize / (1024 * 1024)}MB`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "Cannot upload empty file" };
  }

  // Check file name length
  if (file.name.length > UPLOAD_SECURITY.maxFileNameLength) {
    return { valid: false, error: "File name too long" };
  }

  // Check MIME type
  if (!UPLOAD_SECURITY.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed: ${file.type}`,
    };
  }

  // Check extension
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (UPLOAD_SECURITY.blockedExtensions.includes(ext)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Check for path traversal
  if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
    return { valid: false, error: "Invalid file name" };
  }

  // Check for null bytes
  if (file.name.includes("\0")) {
    return { valid: false, error: "Invalid file name" };
  }

  return { valid: true };
}

/**
 * Generate safe file name
 */
export function generateSafeFileName(originalName: string): string {
  const ext = originalName.slice(originalName.lastIndexOf(".")).toLowerCase();
  const timestamp = Date.now();
  const randomArray = new Uint8Array(8);
  webCrypto.getRandomValues(randomArray);
  const random = Array.from(randomArray, (b) => b.toString(16).padStart(2, "0")).join("");
  return `file-${timestamp}-${random}${ext}`;
}

// ============= REQUEST LOGGING =============

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "security";
  type: string;
  message: string;
  ip?: string;
  userId?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

const securityLogs: LogEntry[] = [];
const MAX_LOG_ENTRIES = 10000;

/**
 * Log security event
 */
export function logSecurityEvent(entry: Omit<LogEntry, "timestamp">): void {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  securityLogs.push(logEntry);

  // Keep log size manageable
  if (securityLogs.length > MAX_LOG_ENTRIES) {
    securityLogs.splice(0, securityLogs.length - MAX_LOG_ENTRIES);
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[SECURITY] ${entry.level}: ${entry.message}`, entry.details || "");
  }
}

/**
 * Log suspicious activity
 */
export function logSuspiciousActivity(
  request: NextRequest,
  reason: string,
  details?: Record<string, unknown>
): void {
  logSecurityEvent({
    level: "security",
    type: "suspicious_activity",
    message: reason,
    ip: request.headers.get("x-forwarded-for") || "unknown",
    path: request.nextUrl.pathname,
    method: request.method,
    userAgent: request.headers.get("user-agent") || undefined,
    details,
  });
}

/**
 * Log authentication event
 */
export function logAuthEvent(
  event: "login" | "logout" | "failed_login" | "password_change" | "account_lock",
  userId?: string,
  details?: Record<string, unknown>
): void {
  logSecurityEvent({
    level: event === "failed_login" || event === "account_lock" ? "warn" : "info",
    type: "auth",
    message: `Authentication event: ${event}`,
    userId,
    details,
  });
}

/**
 * Get recent security logs
 */
export function getSecurityLogs(
  limit: number = 100,
  level?: LogEntry["level"]
): LogEntry[] {
  let logs = [...securityLogs].reverse();
  if (level) {
    logs = logs.filter((l) => l.level === level);
  }
  return logs.slice(0, limit);
}

// ============= API ENDPOINT PROTECTION =============

/**
 * Check if request is from a bot
 */
export function isLikelyBot(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  
  const botPatterns = [
    "bot", "crawler", "spider", "scraper", "curl", "wget",
    "python", "node", "java", "go-http", "httpie",
  ];

  return botPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );
}

/**
 * Validate API request
 */
export function validateAPIRequest(
  request: NextRequest,
  options: {
    requireAuth?: boolean;
    requireCSRF?: boolean;
    rateLimitKey?: string;
    allowedMethods?: string[];
  } = {}
): { valid: boolean; error?: string; status?: number } {
  // Check allowed methods
  if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
    return { valid: false, error: "Method not allowed", status: 405 };
  }

  // Rate limiting
  if (options.rateLimitKey) {
    const limit = rateLimit(options.rateLimitKey);
    if (!limit.allowed) {
      return { valid: false, error: "Too many requests", status: 429 };
    }
  }

  // CSRF protection for mutating requests
  if (options.requireCSRF && ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    if (!validateCSRFToken(request)) {
      return { valid: false, error: "Invalid CSRF token", status: 403 };
    }
  }

  return { valid: true };
}

// ============= CORS CONFIGURATION =============

export const CORS_CONFIG = {
  allowedOrigins: [
    "http://localhost:3000",
    "https://shop.delightwatersolutions.com",
    "https://delightwatersolutions.com",
  ],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-csrf-token",
    "x-request-id",
  ],
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS headers
 */
export function applyCORSHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const origin = request.headers.get("origin") || "";

  if (CORS_CONFIG.allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    CORS_CONFIG.allowedMethods.join(", ")
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    CORS_CONFIG.allowedHeaders.join(", ")
  );
  response.headers.set("Access-Control-Max-Age", CORS_CONFIG.maxAge.toString());
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  return CORS_CONFIG.allowedOrigins.includes(origin);
}

// ============= MIDDLEWARE SECURITY CHECK =============

/**
 * Apply all security checks in middleware
 */
export function applyMiddlewareSecurity(
  request: NextRequest
): NextResponse | null {
  // Block common attack patterns in URL
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempt
    /union\s+select/i, // SQL injection
    /eval\s*\(/i, // Code injection
    /document\.cookie/i, // Cookie theft
  ];

  const url = request.nextUrl.toString();
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      logSuspiciousActivity(request, `Blocked suspicious URL pattern: ${pattern}`, { url });
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Block requests without user-agent (likely automated attacks)
  const userAgent = request.headers.get("user-agent");
  if (!userAgent && !request.nextUrl.pathname.startsWith("/api/")) {
    logSuspiciousActivity(request, "Request without user-agent");
    return new NextResponse("Forbidden", { status: 403 });
  }

  return null; // Request is OK
}

// ============= UTILITY FUNCTIONS =============

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  const array = new Uint8Array(16);
  webCrypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitive(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return "****";
  return "*".repeat(data.length - visibleChars) + data.slice(-visibleChars);
}

/**
 * Check if IP is in allowed range
 */
export function isIPAllowed(
  ip: string,
  allowedRanges: string[] = []
): boolean {
  if (allowedRanges.length === 0) return true;
  return allowedRanges.some((range) => ip.startsWith(range));
}

/**
 * Encrypt sensitive data (Edge-compatible)
 */
export async function encryptData(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const iv = new Uint8Array(16);
  webCrypto.getRandomValues(iv);

  // Derive a 256-bit key from the hex key
  const keyBytes = Uint8Array.from(key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  const cryptoKey = await webCrypto.subtle.importKey(
    "raw",
    keyBytes.slice(0, 32), // Use first 32 bytes for AES-256
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encrypted = await webCrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(data)
  );

  const ivHex = Array.from(iv, (b) => b.toString(16).padStart(2, "0")).join("");
  const encHex = Array.from(new Uint8Array(encrypted), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${ivHex}:${encHex}`;
}

/**
 * Decrypt sensitive data (Edge-compatible)
 */
export async function decryptData(encrypted: string, key: string): Promise<string> {
  const [ivHex, dataHex] = encrypted.split(":");
  const iv = Uint8Array.from(ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  const data = Uint8Array.from(dataHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

  const keyBytes = Uint8Array.from(key.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  const cryptoKey = await webCrypto.subtle.importKey(
    "raw",
    keyBytes.slice(0, 32),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await webCrypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  return new TextDecoder().decode(decrypted);
}
