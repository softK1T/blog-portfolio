import { NextRequest, NextResponse } from "next/server";
import { uploadMedia, type EntityType } from "@/lib/s3";
import { handleError } from "@/lib/utils";

/**
 * API route for handling file uploads to S3-compatible storage.
 *
 * This endpoint accepts multipart form data containing:
 * - `file`: The file to upload (images or videos)
 * - `entityType`: The type of entity the file belongs to ("post", "log", or "project")
 *
 * The file is validated for type and size, then uploaded to S3 with proper organization.
 *
 * @param request - Next.js request object containing form data
 * @returns JSON response with upload result or error message
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append("file", imageFile);
 * formData.append("entityType", "post");
 *
 * const response = await fetch("/api/upload", {
 *   method: "POST",
 *   body: formData
 * });
 *
 * const result = await response.json();
 * // { key: "uploads/posts/images/1234567890-abc123.jpg", type: "image" }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const entityType = formData.get("entityType");

    // Validate file presence
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Normalize entityType to handle potential whitespace or case issues
    const normalizedEntityType = entityType?.toString().trim().toLowerCase();

    // Default to "post" if no entity type is provided
    const finalEntityType = normalizedEntityType || "post";

    // Validate entity type
    if (!["post", "log", "project"].includes(finalEntityType)) {
      return NextResponse.json(
        { error: "Invalid entity type. Must be 'post', 'log', or 'project'" },
        { status: 400 }
      );
    }

    // Define allowed file types for security
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (100MB max for videos, 10MB for images)
    const maxSize = file.type.startsWith("video/")
      ? 100 * 1024 * 1024 // 100MB for videos
      : 10 * 1024 * 1024; // 10MB for images

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSizeMB}MB.` },
        { status: 400 }
      );
    }

    // Upload file to S3-compatible storage
    const result = await uploadMedia(file, finalEntityType as EntityType);

    // Return success response with file metadata
    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
      type: result.type,
    });
  } catch (error) {
    // Handle upload errors with centralized error handling
    const handledError = handleError(error, "Upload error");
    return NextResponse.json({ error: handledError.message }, { status: 500 });
  }
}
