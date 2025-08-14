import { NextRequest, NextResponse } from "next/server";
import { uploadResume } from "@/lib/services/resume-service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
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
    
    // Handle validation errors specifically
    if (error instanceof Error && error.message.includes("Only PDF files")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload resume",
      },
      { status: 500 }
    );
  }
}
