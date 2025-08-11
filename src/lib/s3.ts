import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Required environment variables for S3 configuration.
 * These must be set in the .env.local file for the S3 integration to work.
 */
const requiredEnvVars = {
  ENDPOINT: process.env.ENDPOINT,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
};

// Validate that all required environment variables are present
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

/**
 * S3 client instance configured for S3-compatible storage (e.g., IDrive E2).
 * Uses path-style addressing and auto region for compatibility.
 */
const s3Client = new S3Client({
  endpoint: process.env.ENDPOINT,
  region: "auto", // IDrive E2 uses "auto" region
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for S3-compatible services
});

/**
 * Media type classification for uploaded files.
 */
export type MediaType = "image" | "video";

/**
 * Entity type for organizing uploaded media files.
 * Determines the folder structure in S3.
 */
export type EntityType = "post" | "log" | "project";

/**
 * Generates a unique filename with timestamp and random string.
 * Prevents filename collisions and provides predictable naming.
 *
 * @param originalName - The original filename from the uploaded file
 * @returns Unique filename with timestamp and random string
 *
 * @example
 * ```ts
 * generateFileName("photo.jpg") // Returns: "1703123456789-abc123def456.jpg"
 * ```
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Determines the media type based on the file's MIME type.
 *
 * @param file - The uploaded file object
 * @returns Media type classification ("image" or "video")
 *
 * @example
 * ```ts
 * getMediaType(imageFile) // Returns: "image"
 * getMediaType(videoFile) // Returns: "video"
 * ```
 */
function getMediaType(file: File): MediaType {
  return file.type.startsWith("video/") ? "video" : "image";
}

/**
 * Builds the S3 object key (file path) for storing media files.
 * Organizes files by entity type and media type for better organization.
 *
 * @param entityType - The type of entity (post, log, project)
 * @param mediaType - The type of media (image, video)
 * @param fileName - The generated filename
 * @returns S3 object key with organized folder structure
 *
 * @example
 * ```ts
 * buildS3Key("post", "image", "photo.jpg")
 * // Returns: "uploads/posts/images/1703123456789-abc123def456.jpg"
 * ```
 */
function buildS3Key(
  entityType: EntityType,
  mediaType: MediaType,
  fileName: string
): string {
  return `uploads/${entityType}s/${mediaType}s/${fileName}`;
}

/**
 * Performs the actual S3 upload operation with optional ACL support.
 * Handles file conversion and S3 command creation.
 *
 * @param file - The file to upload
 * @param entityType - The entity type for organization
 * @param useAcl - Whether to attempt setting public-read ACL (may not work with all S3-compatible services)
 * @returns Upload result with key, URL, and media type
 *
 * @throws {Error} When upload fails
 */
async function performUpload(
  file: File,
  entityType: EntityType,
  useAcl: boolean = false
): Promise<{ key: string; url: string; type: MediaType }> {
  // Convert File to Buffer for Node.js S3 client
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const mediaType = getMediaType(file);
  const fileName = generateFileName(file.name);
  const key = buildS3Key(entityType, mediaType, fileName);

  // Prepare S3 command options
  const commandOptions: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ContentLength: file.size,
  };

  // Add ACL if requested (may not work with all S3-compatible services)
  if (useAcl) {
    commandOptions.ACL = "public-read";
  }

  const command = new PutObjectCommand(commandOptions);
  await s3Client.send(command);

  // Construct the public URL
  const endpoint = process.env.ENDPOINT!.replace(/\/$/, "");
  const bucket = process.env.BUCKET_NAME!;
  const url = `${endpoint}/${bucket}/${key}`;

  return {
    key,
    url,
    type: mediaType,
  };
}

/**
 * Uploads a file to S3-compatible storage with automatic fallback handling.
 * Attempts to set public-read ACL first, then falls back to private upload
 * if ACL operations are not supported (common with IDrive E2).
 *
 * @param file - The file to upload
 * @param entityType - The entity type for organizing the file
 * @returns Upload result containing the S3 key, URL, and media type
 *
 * @throws {Error} When upload fails after all retry attempts
 *
 * @example
 * ```ts
 * const result = await uploadMedia(imageFile, "post");
 * console.log(result.key); // "uploads/posts/images/1703123456789-abc123def456.jpg"
 * console.log(result.url); // "https://endpoint/bucket/uploads/posts/images/..."
 * console.log(result.type); // "image"
 * ```
 */
export async function uploadMedia(
  file: File,
  entityType: EntityType
): Promise<{ key: string; url: string; type: MediaType }> {
  try {
    // Try with ACL first (for compatibility with some S3 services)
    return await performUpload(file, entityType, true);
  } catch (error) {
    // If ACL fails, try without ACL (IDrive E2 doesn't support ACL operations)
    if (
      error instanceof Error &&
      (error.message.includes("ACL") || error.message.includes("access"))
    ) {
      try {
        return await performUpload(file, entityType, false);
      } catch {
        throw new Error("Failed to upload file to S3");
      }
    }
    throw new Error("Failed to upload file to S3");
  }
}

/**
 * Generates a direct public URL for media files stored in S3.
 * Note: This only works if the bucket/objects are publicly accessible.
 * For private storage, use getSignedMediaUrl instead.
 *
 * @param key - The S3 object key
 * @returns Direct public URL to the media file
 *
 * @example
 * ```ts
 * const url = getMediaUrl("uploads/posts/images/photo.jpg");
 * // Returns: "https://endpoint/bucket/uploads/posts/images/photo.jpg"
 * ```
 */
export function getMediaUrl(key: string): string {
  const endpoint = process.env.ENDPOINT!.replace(/\/$/, "");
  const bucket = process.env.BUCKET_NAME!;
  return `${endpoint}/${bucket}/${key}`;
}

/**
 * Generates a signed URL for accessing private media files.
 * Creates a temporary, secure URL that expires after the specified time.
 *
 * @param key - The S3 object key
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Signed URL that provides temporary access to the private file
 *
 * @example
 * ```ts
 * const signedUrl = await getSignedMediaUrl("uploads/posts/images/photo.jpg", 3600);
 * // Returns: "https://endpoint/bucket/uploads/posts/images/photo.jpg?X-Amz-Algorithm=..."
 * ```
 */
export async function getSignedMediaUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export default s3Client;
