"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Tag, Code } from "lucide-react";
import { blogService, BlogPost } from "@/lib/services";
import { Container } from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { getPublicAssetUrl } from "@/lib/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allPosts = await blogService.getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <SectionHeader
            align="center"
            title="Development Blog"
            subtitle="Technical walkthroughs, project development insights, and code tutorials."
            icon={<Code className="h-8 w-8 text-primary" />}
          />
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-shadow group"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {post.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Media Gallery */}
                      {post.media && post.media.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                          {post.media.slice(0, 2).map((m, i) => {
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
                                    className="w-full h-32 object-cover"
                                  />
                                ) : (
                                  <video
                                    controls
                                    src={url}
                                    className="w-full h-32 object-cover"
                                  />
                                )}
                              </div>
                            );
                          })}
                          {post.media.length > 2 && (
                            <div className="flex items-center justify-center bg-muted rounded-md border">
                              <span className="text-sm text-muted-foreground">
                                +{post.media.length - 2} more
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Read Development Post
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
          </>
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
      </Container>
    </div>
  );
}
