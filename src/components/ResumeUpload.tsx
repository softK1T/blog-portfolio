import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ResumeInfo } from "@/lib/services/resume-service";

// Types
interface ResumeUploadProps {
  currentResume?: ResumeInfo | null;
  onResumeUpdate?: (resume: ResumeInfo) => void;
}

interface UploadState {
  isUploading: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPE = "application/pdf";

// Utility Functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const validateFile = (file: File): string | null => {
  if (!file.type.includes("pdf")) {
    return "Please select a PDF file";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File size must be less than 5MB";
  }

  return null;
};

// API Functions
const uploadResumeFile = async (file: File): Promise<ResumeInfo> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/resume/upload", {
    // method: "POST
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.resume;
};

const downloadResumeFile = async (
  key: string,
  filename: string
): Promise<void> => {
  const response = await fetch(`/api/resume/download?key=${key}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Download failed");
  }

  // Create a temporary link to download the file
  const link = document.createElement("a");
  link.href = data.downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fetchCurrentResume = async (): Promise<ResumeInfo | null> => {
  const response = await fetch("/api/resume/current");
  if (response.ok) {
    const data = await response.json();
    if (data.success && data.resume) {
      return data.resume;
    }
  }
  return null;
};

// Main Component
export default function ResumeUpload({
  currentResume,
  onResumeUpdate,
}: ResumeUploadProps) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    isLoading: true,
    error: null,
    success: null,
  });
  const [uploadedResume, setUploadedResume] = useState<ResumeInfo | null>(
    currentResume || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current resume on component mount
  useEffect(() => {
    const loadCurrentResume = async () => {
      try {
        const resume = await fetchCurrentResume();
        if (resume) {
          setUploadedResume(resume);
        }
      } catch (error) {
        console.error("Error loading current resume:", error);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadCurrentResume();
  }, []);

  // File selection handler
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setState((prev) => ({ ...prev, error: validationError }));
        return;
      }

      setState((prev) => ({ ...prev, error: null }));
      handleUpload(file);
    },
    []
  );

  // Upload handler
  const handleUpload = useCallback(
    async (file: File) => {
      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        success: null,
      }));

      try {
        const resume = await uploadResumeFile(file);
        setUploadedResume(resume);
        setState((prev) => ({
          ...prev,
          success: "Resume uploaded successfully!",
        }));
        onResumeUpdate?.(resume);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Upload failed",
        }));
      } finally {
        setState((prev) => ({ ...prev, isUploading: false }));
      }
    },
    [onResumeUpdate]
  );

  // Download handler
  const handleDownload = useCallback(async () => {
    if (!uploadedResume) return;

    try {
      await downloadResumeFile(uploadedResume.key, uploadedResume.filename);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Download failed",
      }));
    }
  }, [uploadedResume]);

  // Remove resume handler
  const handleRemove = useCallback(() => {
    setUploadedResume(null);
    setState((prev) => ({
      ...prev,
      success: null,
      error: null,
    }));
  }, []);

  // Loading state
  if (state.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Management
          </CardTitle>
          <CardDescription>
            Upload and manage your resume. Only PDF files up to 5MB are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Management
        </CardTitle>
        <CardDescription>
          Upload and manage your resume. Only PDF files up to 5MB are allowed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error/Success Messages */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{state.success}</AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="resume-upload">Upload New Resume</Label>
          <div className="flex items-center gap-2">
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              ref={fileInputRef}
              disabled={state.isUploading}
              className="flex-1"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={state.isUploading}
              variant="outline"
            >
              {state.isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Select a PDF file (max 5MB)
          </p>
        </div>

        {/* Current Resume Display */}
        {uploadedResume && (
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Current Resume</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadedResume.filename}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedResume.size)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Uploaded: {formatDate(uploadedResume.uploadedAt)}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No Resume State */}
        {!uploadedResume && !state.isUploading && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resume uploaded yet</p>
            <p className="text-sm">Upload a PDF file to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
