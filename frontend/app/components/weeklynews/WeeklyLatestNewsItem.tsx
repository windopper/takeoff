"use client";

import { getLatestWeeklyNews } from "@/app/action/weeklynews";
import WeeklyNewsBackgroundSvg from "./WeeklyNewsBackgroundSvg";
import { getThemeById } from "./utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";

export default function WeeklyLatestNewsItem() {
    const t = useTranslations('weeklynews');
    const [latestWeeklyNews, setLatestWeeklyNews] = useState<any>(null);

    useEffect(() => {
        const fetchLatestNews = async () => {
            const news = await getLatestWeeklyNews();
            setLatestWeeklyNews(news);
        };
        fetchLatestNews();
    }, []);

    if (!latestWeeklyNews) {
        return null;
    }

    const theme = getThemeById(latestWeeklyNews.id);

    return (
      <Link
        href={`/weeklynews/${latestWeeklyNews.id}`}
        className={`relative w-full h-24 overflow-hidden flex flex-col items-center justify-center
          rounded-3xl cursor-pointer border-2shadow-2xl mb-6
          ${theme.bgPrimary.replace('/10', '/5')}
          transition-all duration-300 group
        `}
      >
        {/* 배경 그라데이션 효과 */}
        <div className={`absolute inset-0 ${theme.bgGradient} rounded-3xl`} />

        {/* 뉴스 테마 배경 SVG */}
        <WeeklyNewsBackgroundSvg
          height={800}
          className="absolute inset-0 -translate-y-1/2 top-1/2 w-full opacity-90 group-hover:opacity-80 transition-opacity duration-300"
        />

        {/* 배경 장식 요소 */}
        <div className={`absolute -top-2 -right-2 w-16 h-16 ${theme.decorPrimary} rounded-full blur-xl`} />
        <div className={`absolute -bottom-1 -left-1 w-12 h-12 ${theme.decorSecondary} rounded-full blur-lg`} />

        {/* 메인 콘텐츠 */}
        <div className="relative z-10 text-center px-4">
          <h1
            className={`text-xl md:text-2xl font-bold ${theme.textPrimary} mb-1 
            group-hover:${theme.textHover} transition-colors duration-300 backdrop-blur-sm rounded-full
            text-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
          `}
          >
            📰 {t('latestNews')}
          </h1>
          <p className={`text-sm ${theme.textPrimary.replace('-200', '-200/80')} group-hover:${theme.textPrimary} transition-colors duration-300`}>
            {latestWeeklyNews.title}
          </p>
        </div>

        {/* 우측 화살표 아이콘 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <svg
            className={`w-6 h-6 ${theme.iconColor} group-hover:${theme.iconHover} group-hover:translate-x-1 transition-all duration-300`}
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