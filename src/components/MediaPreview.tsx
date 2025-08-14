import React from "react";
import { MediaItem } from "@/lib/services";
import { getPublicAssetUrl } from "@/lib/utils";

interface MediaPreviewProps {
  media: MediaItem[];
  maxItems?: number;
  className?: string;
  imageHeight?: string;
  showMoreIndicator?: boolean;
}

export default function MediaPreview({
  media,
  maxItems = 2,
  className = "",
  imageHeight = "h-32",
  showMoreIndicator = true,
}: MediaPreviewProps) {
  if (!media || media.length === 0) {
    return null;
  }

  const itemsToShow = media.slice(0, maxItems);
  const hasMore = showMoreIndicator && media.length > maxItems;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 ${className}`}>
      {itemsToShow.map((m: MediaItem, i: number) => {
        const url = getPublicAssetUrl(m.key);
        return (
          <div
            key={`${m.key}-${i}`}
            className="rounded-md overflow-hidden border"
          >
            {m.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={m.caption || `media-${i}`}
                className={`w-full ${imageHeight} object-cover`}
              />
            ) : (
              <video
                controls
                src={url}
                className={`w-full ${imageHeight} object-cover`}
              />
            )}
          </div>
        );
      })}
      {hasMore && (
        <div className="flex items-center justify-center bg-muted rounded-md border">
          <span className="text-sm text-muted-foreground">
            +{media.length - maxItems} more
          </span>
        </div>
      )}
    </div>
  );
} 