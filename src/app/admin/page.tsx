"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Briefcase, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";
import { portfolioService, blogService } from "@/lib/services";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    portfolioCount: 0,
    blogCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [portfolio, blog] = await Promise.all([
          portfolioService.getProjects(),
          blogService.getPosts(),
        ]);
        setStats({
          portfolioCount: portfolio.length,
          blogCount: blog.length,
        });
      } catch {
        // Silently handle error, stats are not critical
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio and blog content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Items
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.portfolioCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Published projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.blogCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">Published posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Portfolio Management
              </CardTitle>
              <CardDescription>
                Add, edit, and manage your portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/portfolio">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </Link>
              <Link href="/portfolio/list">
                <Button variant="outline" className="w-full">
                  View All Projects
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blog Management
              </CardTitle>
              <CardDescription>
                Create and manage your blog posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/blog">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Post
                </Button>
              </Link>
              <Link href="/blog/list">
                <Button variant="outline" className="w-full">
                  View All Posts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates to your portfolio and blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
