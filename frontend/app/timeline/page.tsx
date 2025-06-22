import { Metadata } from "next";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Timeline from "../components/timeline/Timeline";
import TimelineHero from "../components/timeline/TimelineHero";

export const metadata: Metadata = {
  title: "Takeoff. AI Timeline",
  category: "technology",
  description:
    "2015년부터 2025년까지 인공지능의 기술, 정책, 문화 등 다양한 분야에서 일어난 일들을 타임라인으로 정리했습니다.",
  openGraph: {
    images: ["/images/timeline.png"],
    title: "Takeoff. AI Timeline",
    description:
      "2015년부터 2025년까지 인공지능의 기술, 정책, 문화 등 다양한 분야에서 일어난 일들을 타임라인으로 정리했습니다.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/timeline`,
    siteName: "Takeoff. AI Timeline",
    locale: "ko-KR",
    type: "website",
  },
};

export default function TimelinePage() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <TimelineHero />
      <Timeline />
      <Footer />
    </div>
  );
}
