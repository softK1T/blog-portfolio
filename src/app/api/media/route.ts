import { NextRequest, NextResponse } from "next/server";
import { getSignedMediaUrl } from "@/lib/s3";

/**
 * API route for securely serving private media files from S3-compatible storage.
 *
 * This endpoint acts as a proxy that generates short-lived signed URLs for private
 * S3 objects and redirects the client to them. This provides secure access to
 * private storage without exposing credentials to the client.
 *
 * The signed URLs expire after 1 hour by default, providing temporary access
 * to private media files.
 *
 * @param request - Next.js request object containing the S3 key as a query parameter
 * @returns Redirect response to the signed URL or error response
 *
 * @example
 * ```ts
 * // Request: GET /api/media?key=uploads/posts/images/photo.jpg
 * // Response: 302 Redirect to signed S3 URL
 *
 * const response = await fetch("/api/media?key=uploads/posts/images/photo.jpg");
 * // Redirects to: https://endpoint/bucket/uploads/posts/images/photo.jpg?X-Amz-Algorithm=...
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // Extract the S3 key from query parameters
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // Validate that a key was provided
    if (!key) {
      return NextResponse.json(
        { error: "Missing required parameter: key" },
        { status: 400 }
      );
    }

    // Validate key format (basic security check)
    if (!key.startsWith("uploads/")) {
      return NextResponse.json(
        { error: "Invalid key format" },
        { status: 400 }
      );
    }

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedMediaUrl(key, 3600);

    // Redirect the client to the signed URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    // Handle errors gracefully
    console.error("Media proxy error:", error);
    return NextResponse.json(
      { error: "Failed to generate media URL" },
      { status: 500 }
    );
  }
}
