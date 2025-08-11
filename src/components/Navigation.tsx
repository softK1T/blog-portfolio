"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, User, Plus, FileText, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { handleError } from "@/lib/utils";

export default function Navigation() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      handleError(error, "Logout error");
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{siteConfig.name}</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              aria-current={
                pathname?.startsWith("/portfolio") ? "page" : undefined
              }
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname?.startsWith("/portfolio") ? "text-primary" : ""
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/blog"
              aria-current={pathname?.startsWith("/blog") ? "page" : undefined}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname?.startsWith("/blog") ? "text-primary" : ""
              }`}
            >
              Blog
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/portfolio/list">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Projects
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/blog/list">
                            <FileText className="mr-2 h-4 w-4" />
                            Manage Posts
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/portfolio">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/blog">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Post
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader>
                    <SheetTitle className="p-4 border-b text-xl font-semibold">
                      {siteConfig.name}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="p-2 flex flex-col">
                    <Link
                      href="/"
                      className="px-4 py-3 text-sm hover:bg-accent"
                    >
                      Home
                    </Link>
                    <Link
                      href="/portfolio"
                      className="px-4 py-3 text-sm hover:bg-accent"
                    >
                      Portfolio
                    </Link>
                    <Link
                      href="/blog"
                      className="px-4 py-3 text-sm hover:bg-accent"
                    >
                      Blog
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          href="/admin"
                          className="px-4 py-3 text-sm hover:bg-accent"
                        >
                          Admin
                        </Link>
                        <Link
                          href="/portfolio/list"
                          className="px-4 py-3 text-sm hover:bg-accent"
                        >
                          Manage Projects
                        </Link>
                        <Link
                          href="/blog/list"
                          className="px-4 py-3 text-sm hover:bg-accent"
                        >
                          Manage Posts
                        </Link>
                        <Link
                          href="/admin/portfolio"
                          className="px-4 py-3 text-sm hover:bg-accent"
                        >
                          Add Project
                        </Link>
                        <Link
                          href="/admin/blog"
                          className="px-4 py-3 text-sm hover:bg-accent"
                        >
                          Add Post
                        </Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
