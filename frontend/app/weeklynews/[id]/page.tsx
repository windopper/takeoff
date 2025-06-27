import { getWeeklyNews } from "@/app/action/weeklynews";
import WeeklyNewsViewer from "@/app/components/weeklynews/WeeklyNewsViewer";
import NotFound from "@/app/components/common/NotFound";
import { Metadata } from "next";

interface WeeklyNewsPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WeeklyNewsPageProps): Promise<Metadata> {
    const { id } = await params;
    const weeklyNews = await getWeeklyNews(id);

    if (!weeklyNews) {
        return {
            title: "주간 AI 이슈 정리 - Takeoff.",
            description: "요청하신 주간 AI 이슈 정리를 찾을 수 없습니다.",
        };
    }

    const truncatedContent = weeklyNews.content?.length > 150 
        ? weeklyNews.content.substring(0, 150) + "..." 
        : weeklyNews.content;

    return {
        title: `${weeklyNews.title} - Takeoff.`,
        description: truncatedContent || "매주 큐레이션된 AI 분야의 최신 뉴스를 만나보세요",
        openGraph: {
            title: weeklyNews.title,
            description: truncatedContent || "매주 큐레이션된 AI 분야의 최신 뉴스를 만나보세요",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/weeklynews/${id}`,
            siteName: "Takeoff.",
            locale: "ko-KR",
            type: "article",
            publishedTime: weeklyNews.createdAt,
        },
        keywords: ["주간 AI 이슈", "인공지능 뉴스", "AI 정리", "주간 정리", "takeoff"],
        category: "technology",
    };
}

export default async function WeeklyNewsDetailPage({ params }: WeeklyNewsPageProps) {
    const { id } = await params;
    const weeklyNews = await getWeeklyNews(id);

    if (!weeklyNews) {
        return (
            <NotFound />
        );
    }

    return (
        <WeeklyNewsViewer weeklyNews={weeklyNews} />
    )
}