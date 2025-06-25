
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Citation from "../components/benchmarking/Citation";
import Background from "../components/benchmarking/Background";
import BenchmarkHero from "../components/benchmarking/BenchmarkHero";
import { Metadata } from "next";
import BenchmarkSelector from "../components/benchmarking/BenchmarkSelector";

export const metadata: Metadata = {
  title: "Takeoff. AI Benchmarking",
  category: "technology",
  description:
    "인공지능 벤치마크 대시보드",
  openGraph: {
    images: ["/image/benchmark.png"],
    title: "Takeoff. AI Benchmarking",
    description:
      "GPQA, Frontier Math등 13종의 벤치마크 결과를 비교해보세요.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/benchmarking`,
    siteName: "Takeoff.",
    locale: "ko-KR",
    type: "website",
  },
};

export default function Benchmarking() {
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
