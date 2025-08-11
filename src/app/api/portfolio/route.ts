import { NextRequest, NextResponse } from "next/server";
import { portfolioService } from "@/lib/services";

export async function GET() {
  try {
    const projects = await portfolioService.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = await portfolioService.addProject(body);
    return NextResponse.json({ id: projectId });
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}
