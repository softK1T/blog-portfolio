"use client";

import React from "react";
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
} from "@/lib/services";
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
  const {
    data: portfolioItems,
    loading: portfolioLoading,
    error: portfolioError,
  } = useDataLoader({
    loader: () => portfolioService.getProjects(3),
  });

  const {
    data: blogPosts,
    loading: blogLoading,
    error: blogError,
  } = useDataLoader({
    loader: () => blogService.getPosts(3),
  });

  const loading = portfolioLoading || blogLoading;
  const error = portfolioError || blogError;

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
                    id={project.id || ""}
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
