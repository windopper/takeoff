import { BACKEND_URL } from "../constants";
import { takeoffFetch } from "@/utils/fetch";
import { WEEKLY_NEWS_ID_TAG, WEEKLY_NEWS_LATEST_TAG, WEEKLY_NEWS_LIST_TAG } from "../constants/tags";
import { WeeklyNewsPost } from "../types/weeklynews";

const mockWeeklyNewsList: WeeklyNewsPost[] = [
    {
        id: 1,
        title: "주간 AI 이슈 정리",
        content: "주간 AI 이슈 정리",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "주간 AI 이슈 정리",
        content: "주간 AI 이슈 정리",
        createdAt: new Date().toISOString(),
    },
    
    {
        id: 3,
        title: "주간 AI 이슈 정리",
        content: "주간 AI 이슈 정리",
        createdAt: new Date().toISOString(),
    },
];

export async function getWeeklyNewsList() {
    const response = await takeoffFetch(`${BACKEND_URL}/api/weekly-news-list`, {
        method: 'GET',
        next: {
            tags: [WEEKLY_NEWS_LIST_TAG],
        },
    });
    const data = await response.json();
    return data;
}

export async function getWeeklyNewsMockList(): Promise<WeeklyNewsPost[]> {
    return mockWeeklyNewsList;
}

export async function getWeeklyNews(id: string) {
    const response = await takeoffFetch(`${BACKEND_URL}/api/weekly-news?id=${id}`, {
        method: 'GET',
        next: {
            tags: [WEEKLY_NEWS_ID_TAG(id)],
        },
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;
}

export async function getLatestWeeklyNews() {
    const response = await takeoffFetch(`${BACKEND_URL}/api/weekly-news-latest`, {
        method: 'GET',
        next: {
            tags: [WEEKLY_NEWS_LATEST_TAG],
        },
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data;
}
