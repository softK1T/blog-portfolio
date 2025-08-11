import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/services";

export async function GET() {
  try {
    const posts = await blogService.getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = await blogService.addPost(body);
    return NextResponse.json({ id: postId });
  } catch (error) {
    console.error("Error adding blog post:", error);
    return NextResponse.json(
      { error: "Failed to add blog post" },
      { status: 500 }
    );
  }
}
