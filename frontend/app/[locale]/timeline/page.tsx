import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";
import Timeline from "@/app/components/timeline/Timeline";
import { TimelineSvg } from "@/app/components/timeline/TimelineSvg";
import { routing } from "@/i18n/routing";

interface TimelinePageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: TimelinePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'timeline' });
  
  const title = `Takeoff. ${t('title')}`;
  const description = t('description');
  
  return {
    title,
    category: "technology",
    description,
    openGraph: {
      images: ["/image/timeline.png"],
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/timeline`,
      siteName: "Takeoff.",
      locale: locale === 'ko' ? "ko-KR" : "en-US",
      type: "website",
    },
  };
}

export default function TimelinePage() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm -z-40"></div>
      <TimelineSvg className="fixed top-0 left-0 w-full h-full -z-50" />
      <Timeline />
      <Footer />
    </div>
  );
}
