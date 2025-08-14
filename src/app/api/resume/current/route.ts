import { NextResponse } from "next/server";
import { getCurrentResume } from "@/lib/services/resume-service";

export async function GET() {
  try {
    const currentResume = await getCurrentResume();

    if (!currentResume) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      resume: currentResume,
    });
  } catch (error) {
    console.error("Error getting current resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get current resume",
      },
      { status: 500 }
    );
  }
}
