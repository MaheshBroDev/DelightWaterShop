/**
 * Free GIF CDN Service
 * 
 * Supports multiple free GIF sources:
 * 1. Giphy API (Free tier: 1000 requests/day, 500MB storage)
 * 2. Tenor API (Google-owned, free tier available)
 * 3. Supabase Storage (for custom GIF uploads)
 * 4. Direct URL hosting
 * 
 * Use cases:
 * - Product animations (water flow, purification process)
 * - Success celebrations after purchase
 * - Loading animations
 * - Marketing banners
 * - Email templates
 */

// ============= GIPHY API =============

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || "dc6zaTOualJAN"; // Public beta key
const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

export interface GiphyGif {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  images: {
    original: { url: string; width: string; height: string };
    downsized: { url: string; width: string; height: string };
    fixed_height: { url: string; width: string; height: string };
    fixed_width: { url: string; width: string; height: string };
    fixed_height_small: { url: string; width: string; height: string };
    preview: { url: string; width: string; height: string };
  };
  user?: {
    displayName: string;
    avatarUrl: string;
  };
  rating: string;
  importDate: string;
  trendingDatetime: string;
}

/**
 * Search GIFs on Giphy
 * Free tier: 1000 requests/day
 */
export async function searchGifs(
  query: string,
  limit: number = 10,
  offset: number = 0,
  rating: "g" | "pg" | "pg-13" | "r" = "g"
): Promise<GiphyGif[]> {
  try {
    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      rating,
    });

    const response = await fetch(`${GIPHY_BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error("Giphy API error");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Giphy search error:", error);
    return [];
  }
}

/**
 * Get trending GIFs from Giphy
 */
export async function getTrendingGifs(
  limit: number = 10
): Promise<GiphyGif[]> {
  try {
    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      limit: limit.toString(),
    });

    const response = await fetch(`${GIPHY_BASE_URL}/trending?${params}`);
    if (!response.ok) throw new Error("Giphy API error");

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Giphy trending error:", error);
    return [];
  }
}

/**
 * Get GIF by ID from Giphy
 */
export async function getGifById(id: string): Promise<GiphyGif | null> {
  try {
    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
    });

    const response = await fetch(`${GIPHY_BASE_URL}/${id}?${params}`);
    if (!response.ok) throw new Error("Giphy API error");

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Giphy get by ID error:", error);
    return null;
  }
}

/**
 * Get optimized Giphy URL for different use cases
 */
export function getOptimizedGiphyUrl(
  gif: GiphyGif,
  size: "small" | "medium" | "large" | "original" = "medium"
): string {
  switch (size) {
    case "small":
      return gif.images.fixed_height_small.url;
    case "medium":
      return gif.images.fixed_height.url;
    case "large":
      return gif.images.downsized.url;
    case "original":
      return gif.images.original.url;
    default:
      return gif.images.fixed_height.url;
  }
}

// ============= TENOR API (Alternative) =============

const TENOR_API_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY || "";
const TENOR_BASE_URL = "https://tenor.googleapis.com/v2";

export interface TenorGif {
  id: string;
  content_description: string;
  url: string;
  media_formats: {
    gif: { url: string; dims: number[] };
    tinygif: { url: string; dims: number[] };
    nanogif: { url: string; dims: number[] };
    webp: { url: string; dims: number[] };
    mp4: { url: string; dims: number[] };
  };
  created: number;
  itemurl: string;
  hasaudio: boolean;
  tags: string[];
}

/**
 * Search GIFs on Tenor (Google's GIF service)
 * Free tier available with API key
 */
export async function searchTenorGifs(
  query: string,
  limit: number = 10
): Promise<TenorGif[]> {
  if (!TENOR_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      key: TENOR_API_KEY,
      limit: limit.toString(),
      media_filter: "gif,tinygif,webp,mp4",
    });

    const response = await fetch(`${TENOR_BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error("Tenor API error");

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Tenor search error:", error);
    return [];
  }
}

/**
 * Get optimized Tenor URL
 */
export function getOptimizedTenorUrl(
  gif: TenorGif,
  size: "nano" | "tiny" | "medium" | "original" = "medium",
  format: "gif" | "webp" | "mp4" = "gif"
): string {
  if (format === "mp4" && gif.media_formats.mp4) {
    return gif.media_formats.mp4.url;
  }
  if (format === "webp" && gif.media_formats.webp) {
    return gif.media_formats.webp.url;
  }

  switch (size) {
    case "nano":
      return gif.media_formats.nanogif.url;
    case "tiny":
      return gif.media_formats.tinygif.url;
    case "medium":
      return gif.media_formats.gif.url;
    case "original":
      return gif.media_formats.gif.url;
    default:
      return gif.media_formats.gif.url;
  }
}

// ============= PREDEFINED WATER-THEMED GIFS =============

/**
 * Curated water-themed GIF IDs for the Delight brand
 * These are pre-selected water/ocean GIFs from Giphy
 */
export const WATER_GIFS = {
  // Success animations
  success: {
    waterSplash: "l0Hl1ycMldPxe", // Water splash celebration
    cleanWater: "xT5GrjCpJjzX2g8n4E", // Clean water pour
    celebration: "26gsjCZpPolPr", // General celebration
  },

  // Loading animations
  loading: {
    waterFlow: "3o7qDSOvkaCXS0NrwI", // Water flowing
    ripple: "l0HlGR8oGqlah63bG", // Water ripple
    bubbles: "3o7qDUP8pPlxC8QIUM", // Bubbles rising
  },

  // Product showcases
  products: {
    roSystem: "l0HlK3d1KgSi4", // Water purification
    filter: "26gsjCZpPolPr", // Filter animation
    pureWater: "xT5GrjCpJjzX2g8n4E", // Pure water
  },

  // Marketing
  marketing: {
    refreshment: "3o7qE1i9eZJSBd9cY8", // Refreshing water
    health: "l0HlGR8oGqlah63bG", // Health & wellness
    purity: "xT5GrjCpJjzX2g8n4E", // Water purity
  },

  // Empty states
  emptyStates: {
    noResults: "l0Hl1ycMldPxe", // Search no results
    emptyCart: "26gsjCZpPolPr", // Empty cart
    noOrders: "xT5GrjCpJjzX2g8n4E", // No orders yet
  },
};

/**
 * Get Giphy embed URL for iframe embedding
 */
export function getGiphyEmbedUrl(gifId: string): string {
  return `https://giphy.com/embed/${gifId}`;
}

/**
 * Get Giphy share URL
 */
export function getGiphyShareUrl(gifId: string): string {
  return `https://giphy.com/gifs/${gifId}`;
}

// ============= SUPABASE GIF STORAGE =============

/**
 * Upload custom GIF to Supabase Storage
 * For brand-specific animations not available on Giphy
 */
export async function uploadGifToSupabase(
  file: File,
  folder: string = "gifs"
): Promise<{ url: string; path: string } | null> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9-.]/g, "_")
      .substring(0, 50);
    const path = `${folder}/${timestamp}-${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from("animations")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/gif",
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("animations")
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("GIF upload error:", error);
    return null;
  }
}

// ============= WATER-THEMED ANIMATION CSS =============

/**
 * Generate CSS keyframes for water animations
 * Use these in your components for custom animations
 */
export const waterAnimations = {
  ripple: `
    @keyframes water-ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }
  `,
  wave: `
    @keyframes water-wave {
      0% { transform: translateX(0) translateZ(0) scaleY(1); }
      50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
      100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
    }
  `,
  bubble: `
    @keyframes water-bubble {
      0% { transform: translateY(100%) scale(0); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.3; }
      100% { transform: translateY(-100vh) scale(1); opacity: 0; }
    }
  `,
  flow: `
    @keyframes water-flow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  droplet: `
    @keyframes water-droplet {
      0% { transform: translateY(-100%) scaleY(1.2) scaleX(1); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(100%) scaleY(0.8) scaleX(1.2); opacity: 0; }
    }
  `,
};

// ============= USAGE EXAMPLES =============

/**
 * Get GIF for a specific use case
 * @param useCase - The use case (success, loading, empty_cart, etc.)
 * @param size - Size preference
 */
export async function getGifForUseCase(
  useCase: keyof typeof WATER_GIFS,
  size: "small" | "medium" | "large" = "medium"
): Promise<string> {
  const gifMap = WATER_GIFS[useCase];
  if (!gifMap) return "";

  // Pick a random GIF from the use case
  const keys = Object.keys(gifMap) as Array<keyof typeof gifMap>;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const gifId = gifMap[randomKey];

  try {
    const gif = await getGifById(gifId);
    if (gif) {
      return getOptimizedGiphyUrl(gif, size);
    }
  } catch {
    // Fallback to direct URL
  }

  return `https://media.giphy.com/media/${gifId}/giphy.gif`;
}
