import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaItem } from "@/lib/services";
import MediaPreview from "./MediaPreview";

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  media?: MediaItem[];
  tags?: string[];
  date?: Date;
  href: string;
  showDate?: boolean;
  showTags?: boolean;
  className?: string;
}

export default function ContentCard({
  id,
  title,
  description,
  media,
  tags,
  date,
  href,
  showDate = false,
  showTags = false,
  className = "",
}: ContentCardProps) {
  return (
    <Link href={href}>
      <Card className={`hover:shadow-lg transition-shadow group ${className}`}>
        <CardHeader>
          {showDate && date && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">
                {date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-3 max-w-sm lg:max-w-md">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {media && <MediaPreview media={media} />}
          {showTags && tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
