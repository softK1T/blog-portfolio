import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      ENDPOINT: process.env.ENDPOINT ? "✅ Set" : "❌ Missing",
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID ? "✅ Set" : "❌ Missing",
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY
        ? "✅ Set"
        : "❌ Missing",
      BUCKET_NAME: process.env.BUCKET_NAME ? "✅ Set" : "❌ Missing",
    };

    // Check if all required vars are present
    const missingVars = Object.entries(envVars)
      .filter(([, status]) => status === "❌ Missing")
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required environment variables",
          missing: missingVars,
          envVars,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "All S3 environment variables are configured",
      envVars,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Error checking environment variables",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
