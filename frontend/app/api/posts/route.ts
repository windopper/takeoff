import { getTakeoffPosts } from "@/app/action/takeoffPosts";
import { NextRequest, NextResponse } from "next/server";

// mcp-takeoff 전용 api 입니다.
// 최신 5개의 포스트를 반환
// 추후 파라미터 추가 예정
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "ko";
    const posts = await getTakeoffPosts({ limit: 5, language });
    return NextResponse.json(posts);
}