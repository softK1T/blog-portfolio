"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Tag, Code } from "lucide-react";
import { blogService, BlogPost } from "@/lib/services";
import { useDataLoader } from "@/hooks/useDataLoader";
import PageLayout from "@/components/PageLayout";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";

export default function BlogPage() {
  const { data: posts, loading, error } = useDataLoader({
    loader: () => blogService.getPosts(),
  });

  return (
    <PageLayout
      title="Development Blog"
      subtitle="Technical walkthroughs, project development insights, and code tutorials."
      loading={loading}
      error={error}
    >
      {posts && posts.length > 0 ? (
        <ContentGrid loading={loading}>
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <ContentCard
                id={post.id || ""}
                title={post.title}
                description={post.summary}
                media={post.media}
                tags={post.tags}
                date={post.createdAt}
                href={`/blog/${post.id}`}
                showDate={true}
                showTags={true}
              />
              <div className="mt-4">
                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Read Development Post
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </ContentGrid>
      ) : (
        <div className="text-center py-12">
          <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            No Development Posts Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Check back soon for technical walkthroughs and project
            insights!
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Interested in My Development Process?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Each blog post provides detailed technical insights, code
            examples, and lessons learned from building real-world
            applications. Perfect for developers looking to understand modern
            development practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <Button variant="outline">View My Projects</Button>
            </Link>
            <Link href="/admin/blog">
              <Button>
                <Code className="mr-2 h-4 w-4" />
                Add Development Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
