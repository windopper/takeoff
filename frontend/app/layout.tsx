import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  title: "Takeoff.",
  applicationName: "Takeoff.",
  authors: [{ name: "windopper", url: "https://github.com/windopper" }],
  creator: "windopper",
  publisher: "Vercel",
  generator: "Next.js",
  robots: "index, follow",
  openGraph: {
    images: ["/image/takeoff.png"],
    title: "Takeoff.",
    description: "Takeoff는 AI 관련 아티클을 자동으로 정리 및 게시하는 서비스입니다",
    siteName: "Takeoff.",
    type: "website",
    url: "https://ai-takeoff.dev",
    locale: "ko_KR",
  },
  other: {
    "naver-site-verification": "e3e531886f5222bded5c557f0221ef0c00d69e9a"
  },
  category: "AI",
  keywords: ["takeoff", "ai", "article", "ai news", "인공지능 뉴스", "인공지능 정보"],
  description: "Takeoff는 AI 관련 아티클을 자동으로 정리 및 게시하는 서비스입니다"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
