import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts.
 *
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```tsx
 * cn("text-red-500", "text-blue-500") // Returns "text-blue-500"
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4"
 * cn("bg-red-500", { "bg-blue-500": isActive }) // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Centralized error handling utility that provides consistent error formatting
 * and logging across the application.
 *
 * @param error - The error object or value to handle
 * @param context - Context string describing where the error occurred
 * @returns A new Error object with formatted message
 *
 * @example
 * ```tsx
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   throw handleError(error, "Failed to load user data");
 * }
 * ```
 */
export function handleError(error: unknown, context: string): Error {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  const fullMessage = `${context}: ${errorMessage}`;

  // In development, log errors for debugging
  if (process.env.NODE_ENV === "development") {
    console.error(fullMessage, error);
  }

  return new Error(fullMessage);
}

/**
 * Generates a public URL for media files stored in S3-compatible storage.
 * Uses a signed URL proxy to handle private storage access securely.
 *
 * @param key - The S3 object key (file path in bucket)
 * @returns Public URL that can be used to access the media file
 *
 * @example
 * ```tsx
 * const imageUrl = getPublicAssetUrl("uploads/posts/images/photo.jpg");
 * // Returns: "/api/media?key=uploads%2Fposts%2Fimages%2Fphoto.jpg"
 * ```
 */
export function getPublicAssetUrl(key: string): string {
  // Use the signed URL proxy for private S3-compatible storage
  return `/api/media?key=${encodeURIComponent(key)}`;
}
