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
import { Loader2, Plus, X, ArrowLeft, Info } from "lucide-react";
import { portfolioService, PortfolioItem } from "@/lib/services";
import Link from "next/link";
import { getPublicAssetUrl } from "@/lib/utils";

export default function EditPortfolioPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    technologies: [] as string[],
    newTechnology: "",
    githubLink: "",
    liveLink: "",
    featured: false,
    published: false,
    media: [] as { key: string; type: "image" | "video"; caption?: string }[],
  });

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/auth/signin");
    }
  }, [user, isAdmin, loading, router]);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

      try {
        setLoadingProject(true);
        const projectData = await portfolioService.getProject(projectId);
        if (projectData) {
          setProject(projectData);
          setFormData({
            title: projectData.title,
            description: projectData.description,
            content: projectData.content || "",
            technologies: projectData.technologies,
            newTechnology: "",
            githubLink: projectData.githubLink || "",
            liveLink: projectData.liveLink || "",
            featured: projectData.featured,
            published: projectData.published,
            media: projectData.media || [],
          });
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error("Error loading project:", error);
        setError("Failed to load project");
      } finally {
        setLoadingProject(false);
      }
    };

    if (isAdmin && projectId) {
      loadProject();
    }
  }, [projectId, isAdmin]);

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

  const handleAddTechnology = () => {
    if (
      formData.newTechnology.trim() &&
      !formData.technologies.includes(formData.newTechnology.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, prev.newTechnology.trim()],
        newTechnology: "",
      }));
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  const handleFileUpload = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("entityType", "project");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (formData.technologies.length === 0) {
        throw new Error("At least one technology is required");
      }

      await portfolioService.updateProject(projectId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim() || undefined,
        technologies: formData.technologies,
        githubLink: formData.githubLink.trim() || undefined,
        liveLink: formData.liveLink.trim() || undefined,
        featured: formData.featured,
        published: formData.published,
        media: formData.media,
      });

      setSuccess("Project updated successfully!");
      setTimeout(() => {
        router.push("/portfolio/list");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || loadingProject) {
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/portfolio/list">
            <Button>Back to Projects</Button>
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
              <Link href="/portfolio/list">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <CardTitle>Edit Project</CardTitle>
                <CardDescription>
                  Update your portfolio project details
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
                  placeholder="e.g., E-Commerce Platform"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project, its features, and what you learned..."
                  rows={4}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Detailed Content (Markdown)</Label>
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
                  rows={12}
                  disabled={isLoading}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Supports markdown formatting including headers, lists, code
                  blocks, links, and more.
                </p>
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

              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies *</Label>
                <div className="flex gap-2">
                  <Input
                    name="newTechnology"
                    value={formData.newTechnology}
                    onChange={handleInputChange}
                    placeholder="Add a technology (e.g., React, Node.js)"
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTechnology}
                    disabled={isLoading || !formData.newTechnology.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/project"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liveLink">Live Demo Link</Label>
                  <Input
                    id="liveLink"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    placeholder="https://project-demo.vercel.app"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
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
                      Updating Project...
                    </>
                  ) : (
                    "Update Project"
                  )}
                </Button>
                <Link href="/portfolio/list">
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
