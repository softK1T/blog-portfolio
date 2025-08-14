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
import {
  ArrowRight,
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  Download,
  Code,
  Database,
  Globe,
  FileText,
  Briefcase,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  portfolioService,
  blogService,
  PortfolioItem,
  BlogPost,
  MediaItem,
} from "@/lib/services";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import { siteConfig } from "@/lib/site";
import { getPublicAssetUrl } from "@/lib/utils";

const skills = [
  {
    category: "Frontend",
    items: siteConfig.skills.frontend,
  },
  {
    category: "Backend",
    items: siteConfig.skills.backend,
  },
  { category: "Tools", items: siteConfig.skills.tools },
];

export default function Home() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Loading data from Firestore

        const [projects, posts] = await Promise.all([
          portfolioService.getProjects(3),
          blogService.getPosts(3),
        ]);
        // Data loaded successfully
        setPortfolioItems(projects);
        setBlogPosts(posts);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load data"
        );
        // Set empty arrays to show the UI without data
        setPortfolioItems([]);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
            <Link href="/resume.pdf" target="_blank">
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </Link>
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skillGroup) => (
            <Card key={skillGroup.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {skillGroup.category === "Frontend" && (
                    <Code className="h-5 w-5" />
                  )}
                  {skillGroup.category === "Backend" && (
                    <Database className="h-5 w-5" />
                  )}
                  {skillGroup.category === "Tools" && (
                    <Globe className="h-5 w-5" />
                  )}
                  {skillGroup.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge key={skill} variant="secondary">
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 max-w-sm lg:max-w-md">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Media Gallery */}
                  {project.media && project.media.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {project.media
                        .slice(0, 2)
                        .map((m: MediaItem, i: number) => {
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
                      {project.media.length > 2 && (
                        <div className="flex items-center justify-center bg-muted rounded-md border">
                          <span className="text-sm text-muted-foreground">
                            +{project.media.length - 2} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
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

        {portfolioItems.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/portfolio">
              <Button variant="outline" size="lg">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </Container>

      {/* Latest Development Blog Posts Section */}
      <Container className="py-16">
        <SectionHeader
          title="Latest Development Posts"
          subtitle="Technical walkthroughs and project development insights"
          icon={<FileText className="h-8 w-8 text-primary" />}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Media Gallery */}
                  {post.media && post.media.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {post.media.slice(0, 2).map((m: MediaItem, i: number) => {
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
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

        {blogPosts.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
