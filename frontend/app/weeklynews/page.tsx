import WeeklyNewsList from "../components/weeklynews/WeeklyNewsList";
import WeeklyNewsBackgroundSvg from "../components/weeklynews/WeeklyNewsBackgroundSvg";

export default async function WeeklyNewsPage() {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 메인 콘텐츠 */}
        <div className="relative z-10 pt-24 mt-12 pb-12">
          {/* 페이지 헤더 */}
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 text-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                📰 주간 AI 이슈 정리
              </h1>
              <p className="text-sm text-zinc-200/80 max-w-2xl mx-auto">
                매주 큐레이션된 AI 분야의 최신 뉴스를 만나보세요
              </p>
              
              {/* 장식선 */}
              <div className="mt-8 flex items-center justify-center">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-400/50 to-transparent w-64"></div>
              </div>
            </div>
          </div>

          {/* 뉴스 리스트 */}
          <div className="max-w-4xl mx-auto px-6">
            <WeeklyNewsList />
          </div>
        </div>
      </div>
    );
}