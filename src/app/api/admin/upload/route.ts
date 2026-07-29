import { NextRequest, NextResponse } from "next/server";
import { validateFileUpload, generateSafeFileName, rateLimitByIP, RATE_LIMITS } from "@/lib/security";

/**
 * POST /api/admin/upload - Upload image
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const limit = rateLimitByIP(request, RATE_LIMITS.upload);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many uploads. Please try again later." },
        { status: 429 }
      );
    }

    // TODO: Verify admin authentication and permissions
    // const session = await getSession();
    // if (!session || !hasPermission(session.user.role, AdminPermission.IMAGES_UPLOAD)) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFileUpload({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Generate safe filename
    const safeFileName = generateSafeFileName(file.name);
    const folder = formData.get("folder") as string || "products";

    // In production, upload to Supabase Storage or Cloudinary
    // For now, return a mock URL
    
    // Example: Upload to Supabase Storage
    /*
    const { uploadFile } = await import("@/lib/storage/supabase-storage");
    const result = await uploadFile(file, {
      bucket: "products",
      folder: folder,
      fileName: safeFileName,
    });
    */

    // Example: Upload to Cloudinary
    /*
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.upload(file.arrayBuffer(), {
      folder: `delight-water-shop/${folder}`,
      public_id: safeFileName.replace(/\.[^.]+$/, ''),
      resource_type: 'auto',
    });
    */

    // Mock response for now
    const mockUrl = `https://placehold.co/600x600/003b6f/ffffff?text=${encodeURIComponent(file.name.slice(0, 20))}`;

    return NextResponse.json({
      success: true,
      data: {
        url: mockUrl,
        fileName: safeFileName,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
