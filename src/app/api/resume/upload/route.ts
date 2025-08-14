import { NextRequest, NextResponse } from "next/server";
import { uploadResume } from "@/lib/services/resume-service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are allowed for resumes" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume file size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Upload the resume to S3
    const resumeInfo = await uploadResume(file);

    return NextResponse.json({
      success: true,
      resume: resumeInfo,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Environment variable errors
      if (error.message.includes("Missing required S3 environment variables")) {
        return NextResponse.json(
          {
            error: "Server configuration error: Missing S3 credentials",
            details:
              "Please check environment variables: ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME",
          },
          { status: 500 }
        );
      }

      // S3 upload errors
      if (error.message.includes("Failed to upload file to S3")) {
        return NextResponse.json(
          {
            error: "Failed to upload file to storage",
            details:
              "Please try again or contact support if the problem persists",
          },
          { status: 500 }
        );
      }

      // Metadata save errors
      if (error.message.includes("Failed to save resume metadata")) {
        return NextResponse.json(
          {
            error: "Failed to save resume information",
            details: "The file was uploaded but metadata could not be saved",
          },
          { status: 500 }
        );
      }

      // Validation errors
      if (
        error.message.includes("Only PDF files") ||
        error.message.includes("file size")
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: "Failed to upload resume",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
