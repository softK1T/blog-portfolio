"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X, Code } from "lucide-react";
import { getPublicAssetUrl } from "@/lib/utils";
import {
  developmentLogService,
  portfolioService,
  DevelopmentLog,
  PortfolioItem,
} from "@/lib/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const logTypes = [
  {
    value: "milestone",
    label: "Milestone",
    description: "Major project milestones",
  },
  {
    value: "feature",
    label: "Feature",
    description: "New features implemented",
  },
  {
    value: "bug-fix",
    label: "Bug Fix",
    description: "Bugs fixed and issues resolved",
  },
  {
    value: "optimization",
    label: "Optimization",
    description: "Performance improvements",
  },
  { value: "learning", label: "Learning", description: "New things learned" },
];

export default function AddDevelopmentLogPage() {
  const { user, isAdmin, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "feature" as DevelopmentLog["type"],
    date: new Date().toISOString().split("T")[0],
    tags: [] as string[],
    newTag: "",
    published: true,
    media: [] as { key: string; type: "image" | "video"; caption?: string }[],
  });

  // Preview state for media
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<{
    url: string;
    type: "image" | "video";
    caption?: string;
  } | null>(null);

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/auth/signin");
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectId = params.id as string;
        const projectData = await portfolioService.getProject(projectId);
        if (projectData) {
          setProject(projectData);
        } else {
          setError("Project not found");
        }
      } catch {
        setError("Failed to load project");
      }
    };

    if (params.id) {
      loadProject();
    }
  }, [params.id, isAdmin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: DevelopmentLog["type"]) => {
    setFormData((prev) => ({ ...prev, type: value }));
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

  const handleFileUpload = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("entityType", "log");
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

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }
      if (!project) {
        throw new Error("Project not found");
      }

      await developmentLogService.addLog({
        projectId: project.id!,
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        date: new Date(formData.date),
        tags: formData.tags,
        published: formData.published,
        media: formData.media,
      });

      router.push(`/portfolio/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.push("/admin")}>Back to Admin</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-6 w-6 text-primary" />
              <CardTitle>Add Development Log</CardTitle>
            </div>
            <CardDescription>
              Add a development log entry for: <strong>{project.title}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Log Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Implemented User Authentication System"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Log Type *</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select log type" />
                  </SelectTrigger>
                  <SelectContent>
                    {logTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Describe what you worked on, challenges faced, solutions implemented, and lessons learned..."
                  rows={8}
                  required
                  disabled={isLoading}
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
                    {formData.media.map((m, i) => {
                      const url = getPublicAssetUrl(m.key);
                      return (
                        <div
                          key={`${m.key}-${i}`}
                          className="border rounded-md p-2"
                        >
                          <button
                            type="button"
                            className="w-full"
                            onClick={() => {
                              setPreview({
                                url,
                                type: m.type,
                                caption: m.caption,
                              });
                              setIsPreviewOpen(true);
                            }}
                          >
                            {m.type === "image" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={url}
                                alt={m.caption || "uploaded image"}
                                className="w-full h-40 object-cover rounded"
                              />
                            ) : (
                              <video
                                controls
                                src={url}
                                className="w-full h-40 object-cover rounded"
                              />
                            )}
                          </button>
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
                      );
                    })}
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
                    placeholder="Add a tag (e.g., React, Bug Fix, Performance)"
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
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((t) => t !== tag),
                            }))
                          }
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Suggested tags: {project.technologies.join(", ")}, Bug Fix,
                  Performance, Optimization
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Log...
                    </>
                  ) : (
                    "Add Development Log"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/portfolio/${project.id}`)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Media preview</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="w-full">
              {preview.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt={preview.caption || "media preview"}
                  className="w-full h-auto rounded"
                />
              ) : (
                <video
                  controls
                  src={preview.url}
                  className="w-full h-auto rounded"
                />
              )}
              {preview.caption && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {preview.caption}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
