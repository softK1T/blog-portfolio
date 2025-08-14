import React from "react";
import { Loader2 } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  className?: string;
}

export default function PageLayout({
  children,
  title,
  subtitle,
  loading = false,
  error = null,
  maxWidth = "7xl",
  className = "",
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6`}>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background py-8 ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6`}>
        {title && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
