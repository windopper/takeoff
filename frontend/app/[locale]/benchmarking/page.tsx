
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Citation from "../../components/benchmarking/Citation";
import Background from "../../components/benchmarking/Background";
import BenchmarkHero from "../../components/benchmarking/BenchmarkHero";
import { Metadata } from "next";
import BenchmarkSelector from "../../components/benchmarking/BenchmarkSelector";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

interface BenchmarkingPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BenchmarkingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'benchmarking' });
  
  const title = t('metaTitle');
  const description = t('metaDescription');
  const openGraphDescription = t('metaOpenGraphDescription');
  
  return {
    title,
    category: "technology",
    description,
    openGraph: {
      images: ["/image/benchmark.png"],
      title,
      description: openGraphDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/benchmarking`,
      siteName: "Takeoff.",
      locale: locale === 'ko' ? "ko-KR" : "en-US",
      type: "website",
    },
  };
}

export default async function Benchmarking({ params }: BenchmarkingPageProps) {
  const { locale } = await params;
  return (
    <div className="min-h-screen m-auto">
      {/* 배경 효과 */}
      <Background className="fixed top-0 left-0 w-full h-full -z-50" stroke="white" />
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm -z-40"></div>
      <Header />
      <div className="flex flex-col items-center justify-center relative mt-20 pb-16 px-4">
        <BenchmarkHero />
        <BenchmarkSelector />
      </div>
      <div className="relative max-w-6xl m-auto flex flex-col pt-24">
        <Citation />
      </div>
      <Footer />
    </div>
  );
}
