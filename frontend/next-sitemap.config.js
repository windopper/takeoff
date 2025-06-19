/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL, // 사이트의 기본 URL
  generateRobotsTxt: true, // robots.txt 파일 생성 여부
  sitemapSize: 7000, // 각 sitemap의 최대 URL 수
  changefreq: "daily", // 검색 엔진에 대한 URL 업데이트 빈도
  priority: 0.7, // 기본 URL 우선 순위
  exclude: [
    "*/posts*",
    "*/dashboard*",
    "*/search*",
  ],
};

module.exports = config;
