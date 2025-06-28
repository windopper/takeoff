import { WeeklyNewsPost } from "@/app/types/weeklynews";
import { Link } from "@/i18n/routing";
import WeeklyNewsBackgroundSvg from "./WeeklyNewsBackgroundSvg";
// import WeeklyNewsBackgroundSpiralSvg from "./WeeklyNewsBackgroundSpiralSvg";
import { getThemeById } from "./utils";

export default function WeeklyNewsItem({
  weeklyNews,
}: {
  weeklyNews: WeeklyNewsPost;
}) {
  const theme = getThemeById(weeklyNews.id);

  return (
    <Link
      href={`/weeklynews/${weeklyNews.id}`}
      className={`relative w-full h-20 overflow-hidden flex flex-col items-center justify-center
                rounded-2xl cursor-pointer shadow-lg mb-4
                ${theme.bgPrimary}
                transition-all duration-300 group hover:shadow-xl hover:scale-[1.02]
            `}
    >
      {/* 배경 그라데이션 효과 */}
      <div className={`absolute inset-0 ${theme.bgGradient} rounded-2xl`} />

      {/* 뉴스 테마 배경 SVG */}
      <WeeklyNewsBackgroundSvg
        height={600}
        className="absolute inset-0 -translate-y-1/2 top-1/2 w-full opacity-60 group-hover:opacity-40 transition-opacity duration-300"
      />
      {/* <WeeklyNewsBackgroundSpiralSvg
        fill={theme.svgFill}
        height={600}
        className="absolute inset-0 -translate-y-1/2 top-1/2 w-full opacity-60 group-hover:opacity-40 transition-opacity duration-300"
      /> */}

      {/* 배경 장식 요소 */}
      <div className={`absolute -top-1 -right-1 w-12 h-12 ${theme.decorPrimary} rounded-full blur-lg`} />
      <div className={`absolute -bottom-1 -left-1 w-8 h-8 ${theme.decorSecondary} rounded-full blur-md`} />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-4 w-full">
        <h1
          className={`text-lg md:text-xl font-semibold ${theme.textPrimary} 
                    group-hover:${theme.textHover} transition-colors duration-300
                    text-shadow-[0_1px_3px_rgba(0,0,0,0.3)] truncate
                `}
        >
          {weeklyNews.title}
        </h1>
      </div>

      {/* 우측 화살표 아이콘 */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
        <svg
          className={`w-5 h-5 ${theme.iconColor} group-hover:${theme.iconHover} group-hover:translate-x-1 transition-all duration-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
