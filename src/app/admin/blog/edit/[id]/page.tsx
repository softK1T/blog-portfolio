"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X, ArrowLeft, Info } from "lucide-react";
import {
  blogService,
  portfolioService,
  BlogPost,
  PortfolioItem,
} from "@/lib/services";
import Link from "next/link";
import { getPublicAssetUrl } from "@/lib/utils";

export default function EditBlogPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: [] as string[],
    newTag: "",
    published: false,
    projectId: "unlinked",
    media: [] as { key: string; type: "image" | "video"; caption?: string }[],
  });

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/auth/signin");
    }
  }, [user, isAdmin, loading, router]);

  // Load post data and projects
  useEffect(() => {
    const loadData = async () => {
      if (!postId) return;

      try {
        setLoadingPost(true);
        const [postData, projectsData] = await Promise.all([
          blogService.getPost(postId),
          portfolioService.getAllProjects(),
        ]);

        if (postData) {
          setPost(postData);
          setFormData({
            title: postData.title,
            content: postData.content,
            summary: postData.summary,
            tags: postData.tags,
            newTag: "",
            published: postData.published,
            projectId: postData.projectId || "unlinked",
            media: postData.media || [],
          });
        } else {
          setError("Blog post not found");
        }

        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load blog post");
      } finally {
        setLoadingPost(false);
      }
    };

    if (isAdmin && postId) {
      loadData();
    }
  }, [postId, isAdmin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, projectId: value }));
  };

  const handleFileUpload = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("entityType", "post");

    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { key: data.key, type: data.type }],
    }));
  };

  const removeMediaAt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }
      if (!formData.summary.trim()) {
        throw new Error("Summary is required");
      }

      await blogService.updatePost(postId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim(),
        tags: formData.tags,
        published: formData.published,
        projectId:
          formData.projectId === "unlinked" ? undefined : formData.projectId,
        media: formData.media,
      });

      setSuccess("Blog post updated successfully!");
      setTimeout(() => {
        router.push("/blog/list");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || loadingPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Blog Post Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/blog/list">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link href="/blog/list">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Posts
                </Button>
              </Link>
              <div>
                <CardTitle>Edit Blog Post</CardTitle>
                <CardDescription>
                  Update your blog post details and content
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Building an E-Commerce Platform: From Concept to Deployment"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Summary *</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief technical summary of your development process..."
                  rows={3}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">Related Project (Optional)</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project to link this post to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlinked">No project link</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id!}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Linking to a project will show this post in the project&apos;s
                  development feed
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content * (Markdown Supported)</Label>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>
                    Use markdown for formatting. Include code blocks, headers,
                    and technical details.
                  </span>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder={`# Project Title

## Overview
Brief description of your project...

## Technology Stack
- **Frontend**: React, Next.js, TypeScript
- **Backend**: Node.js, Express
- **Database**: MongoDB, PostgreSQL

## Development Process

### Phase 1: Planning
Describe your planning phase...

### Phase 2: Implementation
\`\`\`javascript
// Example code snippet
const example = () => {
  
};
\`\`\`

## Key Learnings
What you learned from this project...

## Deployment
How you deployed the project...`}
                  rows={15}
                  required
                  disabled={isLoading}
                  className="font-mono text-sm"
                />
              </div>

              {/* Media */}
              <div className="space-y-2">
                <Label>Media (Images/Videos)</Label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    const inputEl = e.currentTarget;
                    const file = inputEl?.files?.[0];
                    if (!file) return;
                    setIsLoading(true);
                    setError("");
                    try {
                      await handleFileUpload(file);
                    } catch (err) {
                      setError(
                        err instanceof Error ? err.message : "Upload failed"
                      );
                    } finally {
                      setIsLoading(false);
                      if (inputEl) inputEl.value = "";
                    }
                  }}
                  disabled={isLoading}
                />
                {formData.media.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.media.map((m, i) => (
                      <div
                        key={`${m.key}-${i}`}
                        className="border rounded-md p-2"
                      >
                        {m.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getPublicAssetUrl(m.key)}
                            alt={m.caption || "uploaded image"}
                            className="w-full h-40 object-cover rounded"
                          />
                        ) : (
                          <video
                            controls
                            src={getPublicAssetUrl(m.key)}
                            className="w-full h-40 object-cover rounded"
                          />
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            placeholder="Caption (optional)"
                            value={m.caption || ""}
                            onChange={(e) => {
                              const caption = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                media: prev.media.map((mm, idx) =>
                                  idx === i ? { ...mm, caption } : mm
                                ),
                              }));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeMediaAt(i)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Images up to 5MB. Videos up to 100MB. Files are stored in S3.
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    name="newTag"
                    value={formData.newTag}
                    onChange={handleInputChange}
                    placeholder="Add a tag (e.g., React, Node.js, TypeScript)"
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={isLoading || !formData.newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Suggested tags: React, Next.js, TypeScript, Node.js, MongoDB,
                  PostgreSQL, AWS, Docker, Testing, Performance, Security,
                  Deployment
                </p>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="rounded"
                />
                <Label htmlFor="published">Published</Label>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Post...
                    </>
                  ) : (
                    "Update Blog Post"
                  )}
                </Button>
                <Link href="/blog/list">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
