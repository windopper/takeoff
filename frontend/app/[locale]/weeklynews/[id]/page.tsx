import { getWeeklyNews } from "@/app/action/weeklynews";
import WeeklyNewsViewer from "@/app/components/weeklynews/WeeklyNewsViewer";
import NotFound from "@/app/components/common/NotFound";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface WeeklyNewsPageProps {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: WeeklyNewsPageProps): Promise<Metadata> {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'weeklynews.page' });
    const weeklyNews = await getWeeklyNews(id);

    if (!weeklyNews) {
        return {
            title: t('notFoundTitle'),
            description: t('notFoundDescription'),
        };
    }

    const truncatedContent = weeklyNews.content?.length > 150 
        ? weeklyNews.content.substring(0, 150) + "..." 
        : weeklyNews.content;

    const keywords = t.raw('keywords');
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    return {
        title: `${weeklyNews.title} - Takeoff.`,
        description: truncatedContent || t('metaDescription'),
        openGraph: {
            title: weeklyNews.title,
            description: truncatedContent || t('metaDescription'),
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/weeklynews/${id}`,
            siteName: "Takeoff.",
            locale: locale === 'ko' ? 'ko-KR' : 'en-US',
            type: "article",
            publishedTime: weeklyNews.createdAt,
        },
        keywords: keywordsString,
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