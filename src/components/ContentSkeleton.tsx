import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for the ContentSkeleton component.
 */
interface ContentSkeletonProps {
  /** Whether to show tag skeletons */
  showTags?: boolean;
  /** Whether to show media skeletons */
  showMedia?: boolean;
  /** Number of skeleton items to show */
  count?: number;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * ContentSkeleton component for displaying loading states.
 *
 * This component provides a consistent skeleton loading animation for content
 * that is being fetched from the server. It can be customized to show different
 * elements like tags, media, or multiple items.
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <ContentSkeleton />
 *
 * // Skeleton with tags and media
 * <ContentSkeleton showTags={true} showMedia={true} />
 *
 * // Multiple skeleton items
 * <ContentSkeleton count={3} />
 * ```
 */
export default function ContentSkeleton({
  showTags = false,
  showMedia = false,
  count = 1,
  className = "",
}: ContentSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Tags skeleton */}
          {showTags && (
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          )}

          {/* Media skeleton */}
          {showMedia && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
