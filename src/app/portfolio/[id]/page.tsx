"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Github,
  ExternalLink,
  Code,
  Clock,
  TrendingUp,
  Bug,
  Lightbulb,
  Target,
  FileText,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  portfolioService,
  developmentLogService,
  blogService,
  PortfolioItem,
  DevelopmentLog,
  BlogPost,
} from "@/lib/services";
import { Container } from "@/components/Container";
import ErrorDisplay from "@/components/ErrorDisplay";
import ContentSkeleton from "@/components/ContentSkeleton";
import MediaGallery from "@/components/MediaGallery";

const getLogTypeIcon = (type: DevelopmentLog["type"]) => {
  switch (type) {
    case "milestone":
      return <Target className="h-4 w-4" />;
    case "feature":
      return <Code className="h-4 w-4" />;
    case "bug-fix":
      return <Bug className="h-4 w-4" />;
    case "optimization":
      return <TrendingUp className="h-4 w-4" />;
    case "learning":
      return <Lightbulb className="h-4 w-4" />;
    default:
      return <Code className="h-4 w-4" />;
  }
};

const getLogTypeColor = (type: DevelopmentLog["type"]) => {
  switch (type) {
    case "milestone":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "feature":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "bug-fix":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "optimization":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "learning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function PortfolioProjectPage() {
  const params = useParams();
  // router not needed currently
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [developmentLogs, setDevelopmentLogs] = useState<DevelopmentLog[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectId = params.id as string;
        const [projectData, logsData, postsData] = await Promise.all([
          portfolioService.getProject(projectId),
          developmentLogService.getLogsByProject(projectId),
          blogService.getPostsByProject(projectId),
        ]);

        if (projectData) {
          setProject(projectData);
          setDevelopmentLogs(logsData);
          setBlogPosts(postsData);
        } else {
          setError("Project not found");
        }
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-6">
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-6">
          <ErrorDisplay
            title="Project Not Found"
            message={error || "The requested project could not be found."}
            showBackButton
            backHref="/portfolio"
            backText="Back to Portfolio"
          />
        </div>
      </div>
    );
  }

  // Combine and sort all development content by date
  const allDevelopmentContent = [
    ...developmentLogs.map((log) => ({
      type: "log" as const,
      id: log.id!,
      title: log.title,
      content: log.content,
      date: log.date,
      tags: log.tags,
      logType: log.type,
      media: log.media,
    })),
    ...blogPosts.map((post) => ({
      type: "blog" as const,
      id: post.id!,
      title: post.title,
      content: post.summary,
      date: post.createdAt,
      tags: post.tags,
      logType: null as null,
      media: post.media,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-screen bg-background py-8">
      <Container>
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/portfolio">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {project.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <CardTitle className="text-3xl font-bold mb-4">
              {project.title}
            </CardTitle>
            <p className="text-lg text-muted-foreground mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>View Code</span>
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </CardHeader>
          {project.media && project.media.length > 0 && (
            <CardContent>
              <MediaGallery
                media={project.media}
                className="mt-4"
                imageHeight="h-64"
                gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              />
            </CardContent>
          )}
        </Card>

        {/* Project Content */}
        {project.content && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold mb-4 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold mb-3 mt-5">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-muted-foreground">{children}</li>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                          <code className="text-sm font-mono">{children}</code>
                        </pre>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {project.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Development Feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Development Feed</h2>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${project.id}/logs`}>
                <Button size="sm">
                  <Code className="mr-2 h-4 w-4" />
                  Add Log Entry
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Blog Post
                </Button>
              </Link>
            </div>
          </div>

          {allDevelopmentContent.length > 0 ? (
            <div className="space-y-6">
              {allDevelopmentContent.map((item) => (
                <Card
                  key={`${item.type}-${item.id}`}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-full ${
                            item.type === "log"
                              ? getLogTypeColor(item.logType!)
                              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          }`}
                        >
                          {item.type === "log" ? (
                            getLogTypeIcon(item.logType!)
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {item.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              {item.type === "log"
                                ? "Development Log"
                                : "Blog Post"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.date.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            {item.type === "log" && item.logType && (
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {item.logType.replace("-", " ")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.media && item.media.length > 0 && (
                      <MediaGallery
                        media={item.media}
                        className="mb-4"
                        imageHeight="h-56"
                        gridCols="grid-cols-1 sm:grid-cols-2"
                      />
                    )}
                    <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                      {item.content}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {item.type === "blog" && (
                      <div className="mt-4">
                        <Link href={`/blog/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Full Post
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Development Content Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Development logs and blog posts will appear here as you work
                  on this project.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href={`/admin/projects/${project.id}/logs`}>
                    <Button>
                      <Code className="mr-2 h-4 w-4" />
                      Add First Log Entry
                    </Button>
                  </Link>
                  <Link href="/admin/blog">
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Add Blog Post
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Interested in My Development Process?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Each development log shows my real-time progress, challenges
              faced, and solutions implemented. Blog posts provide detailed
              technical walkthroughs and insights. This demonstrates my
              problem-solving skills and development workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button variant="outline">View All Projects</Button>
              </Link>
              <Link href="/blog">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read All Blog Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
