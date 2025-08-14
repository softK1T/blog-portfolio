import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ContentGridProps {
  children: React.ReactNode;
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export default function ContentGrid({
  children,
  loading = false,
  skeletonCount = 6,
  className = "",
}: ContentGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {children}
    </div>
  );
}
