import { WEEKLY_NEWS_ID_TAG, WEEKLY_NEWS_LATEST_TAG, WEEKLY_NEWS_LIST_TAG } from "@/app/constants/tags";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// revalidate weekly news list
export async function POST(request: NextRequest) {
    const { id } = await request.json();
    revalidateTag(WEEKLY_NEWS_LIST_TAG);
    revalidateTag(WEEKLY_NEWS_LATEST_TAG);
    revalidateTag(WEEKLY_NEWS_ID_TAG(id));

    return NextResponse.json({ message: "Weekly news revalidated" });
}