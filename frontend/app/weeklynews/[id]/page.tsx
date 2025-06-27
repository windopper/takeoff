import { getWeeklyNews } from "@/app/action/weeklynews";
import WeeklyNewsViewer from "@/app/components/weeklynews/WeeklyNewsViewer";
import NotFound from "@/app/components/common/NotFound";

export default async function WeeklyNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
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