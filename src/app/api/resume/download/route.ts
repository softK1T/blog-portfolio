import { NextRequest, NextResponse } from "next/server";
import { getResumeDownloadUrl } from "@/lib/services/resume-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Resume key is required" },
        { status: 400 }
      );
    }

    // Get signed URL for download
    const downloadUrl = await getResumeDownloadUrl(key);

    return NextResponse.json({
      success: true,
      downloadUrl,
    });
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate download URL",
      },
      { status: 500 }
    );
  }
}
