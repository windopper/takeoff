import { getWeeklyNewsList } from "@/app/action/weeklynews";
import { NextRequest, NextResponse } from "next/server";

// mcp-takeoff 전용 api 입니다.
// 가장 최신의 주간 뉴스 리스트를 반환
export async function GET(request: NextRequest) {
    const weeklyNewsList = await getWeeklyNewsList("ko");
    return NextResponse.json(weeklyNewsList);
}