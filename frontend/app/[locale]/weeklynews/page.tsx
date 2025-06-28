import WeeklyNewsList from "../../components/weeklynews/WeeklyNewsList";
import WeeklyNewsBackgroundSvg from "../../components/weeklynews/WeeklyNewsBackgroundSvg";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LoadingCard } from "../../components/common";

interface WeeklyNewsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WeeklyNewsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'weeklynews.page' });
    
    // keywords가 배열인 경우 문자열로 변환
    const keywords = t.raw('keywords');
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    
    return {
        title: t('metaTitle'),
        category: "technology",
        description: t('metaDescription'),
        keywords: keywordsString,
        openGraph: {
            images: ["/image/takeoff.png"],
            title: t('metaTitle'),
            description: t('metaDescription'),
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/weeklynews`,
            siteName: "Takeoff.",
            locale: locale === 'ko' ? 'ko-KR' : 'en-US',
            type: "website",
        },
    };
}

export default async function WeeklyNewsPage({ params }: WeeklyNewsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'weeklynews.page' });
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 메인 콘텐츠 */}
        <div className="relative z-10 pt-24 mt-12 pb-12">
          {/* 페이지 헤더 */}
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 text-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {t('title')}
              </h1>
              <p className="text-sm text-zinc-200/80 max-w-2xl mx-auto">
                {t('description')}
              </p>
              
              {/* 장식선 */}
              <div className="mt-8 flex items-center justify-center">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-400/50 to-transparent w-64"></div>
              </div>
            </div>
          </div>

          {/* 뉴스 리스트 */}
          <div className="max-w-4xl mx-auto px-6">
            <Suspense fallback={<LoadingCard variant="compact" />}>
              <WeeklyNewsList locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    );
}