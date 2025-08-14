"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  Github,
  Code,
} from "lucide-react";
import { portfolioService } from "@/lib/services";
import PageLayout from "@/components/PageLayout";
import { useDataLoader } from "@/hooks/useDataLoader";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";

export default function PortfolioPage() {
  // Memoize loader function to prevent continuous re-renders
  const portfolioLoader = useCallback(() => portfolioService.getProjects(), []);

  const {
    data: portfolioItems,
    loading,
    error,
  } = useDataLoader({
    loader: portfolioLoader,
  });

  return (
    <PageLayout
      title="Portfolio"
      subtitle="A collection of my projects and work that showcases my skills and experience"
      loading={loading}
      error={error}
    >
      {portfolioItems && portfolioItems.length > 0 ? (
        <ContentGrid loading={loading}>
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
              <div className="mt-4 space-y-3">
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          ))}
        </ContentGrid>
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
    </PageLayout>
  );
}
