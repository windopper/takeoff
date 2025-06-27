import { getWeeklyNewsList } from "@/app/action/weeklynews";
import WeeklyNewsItem from "./WeeklyNewsItem";
import { WeeklyNewsPost } from "@/app/types/weeklynews";

export default async function WeeklyNewsList() {
    const weeklyNewsList = await getWeeklyNewsList();

    if (weeklyNewsList.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-emerald-800/20 rounded-2xl p-8 border border-emerald-700/30">
                    <h3 className="text-xl font-semibold text-emerald-200 mb-2">
                        아직 주간 뉴스가 없습니다
                    </h3>
                    <p className="text-emerald-300/80">
                        곧 첫 번째 주간 뉴스를 만나보실 수 있습니다!
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
                    총 <span className="font-semibold text-zinc-200">{weeklyNewsList.length}</span>개의 주간 뉴스
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
