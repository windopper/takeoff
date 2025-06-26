import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  title: "Takeoff.",
  verification: {
    google: "d8Ovesw9e_k8y4kyS7FT6fTDVniHGZ46W5Dzo_pGlLk"
  },
  other: {
    "naver-site-verification": "91d079d1884e5ac2ed81c793a4ac22c8dad11413"
  },
  category: "technology",
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
