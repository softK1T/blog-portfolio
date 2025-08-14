"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ResumeUpload from "@/components/ResumeUpload";
import { ResumeInfo } from "@/lib/services/resume-service";

export default function ResumeManagementPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  // Handle authentication redirect
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  const handleResumeUpdate = (resume: ResumeInfo) => {
    // You can add additional logic here, such as:
    // - Updating a database record
    // - Sending notifications
    // - Logging the update
    console.log("Resume updated:", resume);
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
    return null;
  }

  return (
    <PageLayout
      title="Resume Management"
      subtitle="Upload and manage your resume for the portfolio"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <ResumeUpload onResumeUpdate={handleResumeUpdate} />

        {/* Additional Information */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">About Resume Management</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Your resume is stored securely in S3-compatible storage</p>
            <p>• Only PDF files up to 5MB are accepted</p>
            <p>• The resume will be available for download on your portfolio</p>
            <p>• You can update your resume anytime by uploading a new file</p>
            <p>
              • The download link on your portfolio will automatically use the
              latest version
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
