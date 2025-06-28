import { getWeeklyNewsList } from "@/app/action/weeklynews";
import WeeklyNewsItem from "./WeeklyNewsItem";
import { WeeklyNewsPost } from "@/app/types/weeklynews";
import { getTranslations } from "next-intl/server";

export default async function WeeklyNewsList({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'weeklynews.list' });
    // const commonT = await getTranslations({ locale, namespace: 'common' });
    const weeklyNewsList = await getWeeklyNewsList();

    // useEffect(() => {
        // const fetchWeeklyNews = async () => {
        //     try {
        //         const newsList = await getWeeklyNewsList();
        //         setWeeklyNewsList(newsList);
        //     } catch (error) {
        //         console.error('Failed to fetch weekly news:', error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchWeeklyNews();
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="text-center py-12">
    //             <div className="bg-zinc-800/20 rounded-2xl p-8 border border-zinc-700/30">
    //                 <p className="text-zinc-300/80">{commonT('loading')}</p>
    //             </div>
    //         </div>
    //     );
    // }
    if (weeklyNewsList.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-emerald-800/20 rounded-2xl p-8 border border-emerald-700/30">
                    <h3 className="text-xl font-semibold text-emerald-200 mb-2">
                        {t('noNewsTitle')}
                    </h3>
                    <p className="text-emerald-300/80">
                        {t('noNewsDescription')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 뉴스 카운트 */}
            <div className="text-center mb-8">
                <p className="text-zinc-300/80 text-sm">
                    {t('newsCount', { count: weeklyNewsList.length })}
                </p>
            </div>

            {/* 뉴스 아이템들 */}
            <div className="space-y-4">
                {weeklyNewsList.map((weeklyNews: WeeklyNewsPost, index: number) => (
                    <div 
                        key={weeklyNews.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <WeeklyNewsItem weeklyNews={weeklyNews} />
                    </div>
                ))}
            </div>

            {/* 하단 여백 */}
            <div className="h-12"></div>
        </div>
    );
}
