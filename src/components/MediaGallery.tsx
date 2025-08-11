import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Image, Video } from "lucide-react";
import { MediaItem } from "@/lib/services";
import { getPublicAssetUrl } from "@/lib/utils";
import NextImage from "next/image";

/**
 * Props for the MediaGallery component.
 */
interface MediaGalleryProps {
  /** Array of media items to display */
  media: MediaItem[];
  /** Additional CSS classes for styling */
  className?: string;
  /** Height class for images (e.g., "h-64", "h-80") */
  imageHeight?: string;
  /** Grid columns class (e.g., "grid-cols-2", "grid-cols-1 lg:grid-cols-3") */
  gridCols?: string;
  /** Whether to show captions below media items */
  showCaptions?: boolean;
  /** Maximum number of items to show before collapsing */
  maxItems?: number;
}

/**
 * MediaGallery component for displaying a grid of images and videos.
 *
 * Features:
 * - Responsive grid layout
 * - Click-to-preview modal for full-size viewing
 * - Support for both images and videos
 * - Optional captions
 * - Collapsible grid for large collections
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * <MediaGallery
 *   media={[
 *     { key: "uploads/posts/images/photo1.jpg", type: "image", caption: "Screenshot 1" },
 *     { key: "uploads/posts/videos/demo.mp4", type: "video", caption: "Demo video" }
 *   ]}
 *   imageHeight="h-64"
 *   gridCols="grid-cols-2 lg:grid-cols-3"
 *   showCaptions={true}
 * />
 * ```
 */
export default function MediaGallery({
  media,
  className = "",
  imageHeight = "h-48",
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  showCaptions = false,
  maxItems = 6,
}: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Determine which items to show
  const itemsToShow = showAll ? media : media.slice(0, maxItems);
  const hasMoreItems = media.length > maxItems;

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Media Grid */}
      <div className={`grid gap-4 ${gridCols}`}>
        {itemsToShow.map((item, index) => (
          <div key={item.key} className="relative group">
            {/* Media Item */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-auto w-full overflow-hidden rounded-lg border border-border/50 hover:border-border transition-colors"
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.type === "image" ? (
                    <NextImage
                      src={getPublicAssetUrl(item.key)}
                      alt={item.caption || `Image ${index + 1}`}
                      width={400}
                      height={300}
                      className={`w-full ${imageHeight} object-cover transition-transform group-hover:scale-105`}
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`relative w-full ${imageHeight} bg-muted flex items-center justify-center`}
                    >
                      <video
                        src={getPublicAssetUrl(item.key)}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        aria-label={item.caption || `Video ${index + 1}`}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  )}

                  {/* Media Type Indicator */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded">
                    {item.type === "image" ? (
                      <Image className="h-4 w-4" aria-label="Image" />
                    ) : (
                      <Video className="h-4 w-4" aria-label="Video" />
                    )}
                  </div>
                </Button>
              </DialogTrigger>

              {/* Preview Modal */}
              <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <DialogTitle className="sr-only">
                  {selectedMedia?.caption || `${selectedMedia?.type} Preview`}
                </DialogTitle>
                <div className="relative w-full h-full flex items-center justify-center">
                  {selectedMedia?.type === "image" ? (
                    <NextImage
                      src={getPublicAssetUrl(selectedMedia.key)}
                      alt={selectedMedia.caption || "Preview"}
                      width={1920}
                      height={1080}
                      className="max-w-full max-h-full object-contain"
                      unoptimized
                      priority
                      sizes="100vw"
                    />
                  ) : (
                    <video
                      src={getPublicAssetUrl(selectedMedia?.key || "")}
                      controls
                      className="max-w-full max-h-full"
                      autoPlay
                      aria-label={selectedMedia?.caption || "Video preview"}
                    />
                  )}

                  {/* Caption Overlay */}
                  {selectedMedia?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                      <p className="text-sm">{selectedMedia.caption}</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Caption */}
            {showCaptions && item.caption && (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                {item.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreItems && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="px-6"
          >
            {showAll ? "Show Less" : `Show ${media.length - maxItems} More`}
          </Button>
        </div>
      )}
    </div>
  );
}
