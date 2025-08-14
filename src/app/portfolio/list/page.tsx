"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Code,
  Loader2,
  AlertCircle,
  Calendar,
  Tag,
} from "lucide-react";
import { portfolioService } from "@/lib/services";
import { useDataLoader } from "@/hooks/useDataLoader";
import PageLayout from "@/components/PageLayout";

export default function PortfolioListPage() {
  const { user, isAdmin, loading } = useAuth();

  // Memoize loader function to prevent continuous re-renders
  const portfolioLoader = useCallback(
    () => portfolioService.getAllProjects(),
    []
  );

  const {
    data: projects,
    loading: loadingProjects,
    error,
    refetch,
  } = useDataLoader({
    loader: portfolioLoader,
  });

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await portfolioService.deleteProject(projectId);
      refetch(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const togglePublished = async (
    projectId: string,
    currentPublished: boolean
  ) => {
    try {
      await portfolioService.updateProject(projectId, {
        published: !currentPublished,
      });
      refetch(); // Refresh the data after update
    } catch (error) {
      console.error("Error updating project:", error);
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You need admin access to view this page.
          </p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Portfolio Projects"
      subtitle="Manage your portfolio projects and their content"
      loading={loadingProjects}
      error={error}
    >
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Link href="/admin/portfolio">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.published).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Featured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.featured).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  With Dev Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {
                    projects.filter(
                      (p) => p.developmentLogs && p.developmentLogs.length > 0
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                View and manage all your portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Technologies</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Dev Logs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs lg:max-w-md">
                            {project.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              project.published ? "default" : "secondary"
                            }
                            className="w-fit"
                          >
                            {project.published ? "Published" : "Draft"}
                          </Badge>
                          {project.featured && (
                            <Badge variant="outline" className="w-fit">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {project.createdAt.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {project.developmentLogs?.length || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/portfolio/${project.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/portfolio/edit/${project.id}`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/projects/${project.id}/logs`}>
                                <Code className="mr-2 h-4 w-4" />
                                Dev Logs
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                togglePublished(project.id!, project.published)
                              }
                            >
                              {project.published ? (
                                <>
                                  <Tag className="mr-2 h-4 w-4" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Tag className="mr-2 h-4 w-4" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProject(project.id!)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No projects found</p>
            <p className="text-sm mt-2">
              Get started by adding your first portfolio project
            </p>
          </div>
          <Link href="/admin/portfolio">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </Link>
        </div>
      )}
    </PageLayout>
  );
}
