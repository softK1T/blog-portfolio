"use client";

import React, { useEffect, useState } from "react";
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
  Github,
  ExternalLink,
  Loader2,
  Briefcase,
  Code,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { portfolioService, PortfolioItem, MediaItem } from "@/lib/services";
import { getPublicAssetUrl } from "@/lib/utils";

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const projects = await portfolioService.getProjects();
        setPortfolioItems(projects);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of my projects and work that showcases my skills and
            experience
          </p>
        </div>

        {/* Portfolio Grid */}
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
                  <CardDescription className="line-clamp-3">
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

                  <div className="flex items-center justify-between">
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
                    <div className="flex gap-2">
                      {project.developmentLogs &&
                        project.developmentLogs.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Code className="h-3 w-3 mr-1" />
                            {project.developmentLogs.length} dev logs
                          </Badge>
                        )}
                      {/* Blog posts count will be shown dynamically when we load the data */}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.githubLink && (
                      <Link
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Github className="h-3 w-3" />
                          Code
                        </Button>
                      </Link>
                    )}
                    {project.liveLink && (
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </Button>
                      </Link>
                    )}
                    <Link href={`/portfolio/${project.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Briefcase className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p>
                Projects will appear here once they&apos;re added to the
                portfolio.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
