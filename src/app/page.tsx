"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  Download,
  Code,
  Database,
  FileText,
  Briefcase,
  Loader2,
  AlertCircle,
  Cloud,
  Settings,
  Users,
  Languages,
} from "lucide-react";
import { portfolioService, blogService } from "@/lib/services";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import { siteConfig } from "@/lib/site";
import { useDataLoader } from "@/hooks/useDataLoader";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";

const skills = [
  {
    category: "Data & Orchestration",
    items: siteConfig.skills.dataOrchestration,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    category: "DevOps & Cloud",
    items: siteConfig.skills.devopsCloud,
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    category: "Backend",
    items: siteConfig.skills.backend,
    icon: <Database className="h-5 w-5" />,
  },
  {
    category: "Frontend",
    items: siteConfig.skills.frontend,
    icon: <Code className="h-5 w-5" />,
  },
  {
    category: "Tools",
    items: siteConfig.skills.tools,
    icon: <Settings className="h-5 w-5" />,
  },
  {
    category: "Soft Skills",
    items: siteConfig.skills.softSkills,
    icon: <Users className="h-5 w-5" />,
  },
  {
    category: "Languages",
    items: siteConfig.skills.languages,
    icon: <Languages className="h-5 w-5" />,
  },
];

export default function Home() {
  // Memoize loader functions to prevent continuous re-renders
  const portfolioLoader = useCallback(
    () => portfolioService.getProjects(3),
    []
  );
  const blogLoader = useCallback(() => blogService.getPosts(3), []);

  const {
    data: portfolioItems,
    loading: portfolioLoading,
    error: portfolioError,
  } = useDataLoader({
    loader: portfolioLoader,
  });

  const {
    data: blogPosts,
    loading: blogLoading,
    error: blogError,
  } = useDataLoader({
    loader: blogLoader,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const error = portfolioError || blogError;

  const handleResumeDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      // First, get the current resume information
      const currentResumeResponse = await fetch("/api/resume/current");

      if (!currentResumeResponse.ok) {
        // If no resume is found, fallback to static file
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const currentResumeData = await currentResumeResponse.json();

      if (!currentResumeData.success || !currentResumeData.resume) {
        throw new Error("No current resume found");
      }

      // Get signed download URL for the current resume
      const response = await fetch(
        `/api/resume/download?key=${currentResumeData.resume.key}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate download URL");
      }

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = currentResumeData.resume.filename || "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("Failed to get download URL");
      }
    } catch (error) {
      console.error("Resume download error:", error);
      setDownloadError("Failed to download resume. Please try again.");

      // Fallback to static file
      try {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <Container className="py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Hi, I&apos;m {siteConfig.author.name}
            </h1>
            <h2 className="text-2xl font-light text-muted-foreground">
              {siteConfig.author.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {siteConfig.author.description}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-8">
            <Link href="/portfolio">
              <Button size="lg">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleResumeDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Resume
            </Button>
          </div>

          {downloadError && (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-6 pt-8">
            <a
              href={siteConfig.social.email}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </Container>

      {/* Error Display */}
      {error && (
        <Container className="py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Container>
      )}

      {/* Skills Section */}
      <Container className="py-16">
        <SectionHeader
          title="Skills & Technologies"
          subtitle="Technologies I work with to bring ideas to life"
          icon={<Code className="h-8 w-8 text-primary" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <Card key={skillGroup.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {skillGroup.icon}
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Featured Projects Section */}
      <Container className="py-16">
        <SectionHeader
          title="Featured Projects"
          subtitle="Some of my recent work that showcases my skills"
          icon={<Briefcase className="h-8 w-8 text-primary" />}
        />

        {portfolioLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : portfolioItems && portfolioItems.length > 0 ? (
          <>
            <ContentGrid loading={portfolioLoading}>
              {portfolioItems.map((project) => (
                <div key={project.id} className="relative">
                  <ContentCard
                    title={project.title}
                    description={project.description}
                    media={project.media}
                    tags={project.technologies}
                    href={`/portfolio/${project.id}`}
                    showTags={true}
                  />
                  <div className="mt-4 flex items-center gap-2">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </ContentGrid>
            <div className="text-center mt-8">
              <Link href="/portfolio">
                <Button variant="outline" size="lg">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />}
            title="No projects found"
            description="Add your first project using the admin panel"
            action={
              <Link href="/admin/portfolio">
                <Button>
                  Add Your First Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            }
          />
        )}
      </Container>

      {/* Latest Development Blog Posts Section */}
      <Container className="py-16">
        <SectionHeader
          title="Latest Development Posts"
          subtitle="Technical walkthroughs and project development insights"
          icon={<FileText className="h-8 w-8 text-primary" />}
        />

        {blogLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <>
            <ContentGrid loading={blogLoading}>
              {blogPosts.map((post) => (
                <div key={post.id} className="relative">
                  <ContentCard
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
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </ContentGrid>
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />}
            title="No blog posts found"
            description="Add your first blog post using the admin panel"
            action={
              <Link href="/admin/blog">
                <Button>
                  Add Your First Blog Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            }
          />
        )}
      </Container>

      {/* Contact Section */}
      <Container className="py-16">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold">Let&apos;s Work Together</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and exciting
            projects. Whether you have a question or just want to say hi, feel
            free to reach out!
          </p>
          <div className="flex justify-center gap-4">
            <a href={siteConfig.social.email}>
              <Button size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Get In Touch
              </Button>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
