"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { blogService, BlogPost } from "@/lib/services";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ErrorDisplay from "@/components/ErrorDisplay";
import ContentSkeleton from "@/components/ContentSkeleton";
import MediaGallery from "@/components/MediaGallery";

// Custom components for React Markdown
const markdownComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
    <div className="mt-12 mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-3" {...props}>
        {children}
      </h1>
      <div className="w-16 h-1 bg-primary/30 rounded-full"></div>
    </div>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <div className="mt-10 mb-6">
      <h2 className="text-xl font-bold text-foreground mb-2" {...props}>
        {children}
      </h2>
      <div className="w-12 h-0.5 bg-muted-foreground/30 rounded-full"></div>
    </div>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-lg font-bold mt-8 mb-3 text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  li: ({ children, ...props }: React.ComponentPropsWithoutRef<"li">) => (
    <li
      className="ml-6 mb-2 text-muted-foreground leading-relaxed flex items-start"
      {...props}
    >
      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 mr-3 flex-shrink-0"></span>
      <span>{children}</span>
    </li>
  ),
  code: ({
    children,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"code"> & { className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-muted/80 px-2 py-1 rounded-md text-sm font-mono text-primary border border-border/50"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>
        <code className={className}>{children}</code>
      </pre>
    );
  },
  strong: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
};

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = params.id as string;
        const postData = await blogService.getPost(postId);
        if (postData) {
          setPost(postData);
        } else {
          setError("Post not found");
        }
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          <ErrorDisplay
            title="Post Not Found"
            message={error || "The requested post could not be found."}
            showBackButton
            backHref="/blog"
            backText="Back to Blog"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="mb-4 hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <div className="mb-8">
          {/* Date and Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {post.summary}
          </p>

          {/* Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>

        {/* Media Gallery */}
        {post.media && post.media.length > 0 && (
          <div className="mb-8">
            <MediaGallery media={post.media} className="mb-8" />

            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mt-8"></div>
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex justify-center">
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-2 hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Development Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
