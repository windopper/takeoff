/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL, // 사이트의 기본 URL
  generateRobotsTxt: true, // robots.txt 파일 생성 여부
  sitemapSize: 7000, // 각 sitemap의 최대 URL 수
  changefreq: "daily", // 검색 엔진에 대한 URL 업데이트 빈도
  priority: 1, // 기본 URL 우선 순위
  exclude: [
    "/posts/*",
    "/dashboard",
    "/search",
    "/ko/posts/*",
    "/en/posts/*",
    "/ko/dashboard",
    "/en/dashboard", 
    "/ko/search",
    "/en/search",
  ],
  // 다국어 지원을 위한 추가 URLs
  additionalPaths: async (config) => {
    const paths = [];
    const locales = ['ko', 'en'];
    const routes = [
      '',
      '/about',
      '/benchmarking', 
      '/timeline',
      '/webhook',
      '/weeklynews'
    ];

    for (const locale of locales) {
      for (const route of routes) {
        paths.push({
          loc: `/${locale}${route}`,
          changefreq: 'daily',
          priority: locale === 'ko' ? 1.0 : 0.8, // 한국어를 기본 언어로 우선순위 설정
          lastmod: new Date().toISOString(),
        });
      }
    }

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/posts/*",
          "/search",
          "/ko/posts/*",
          "/en/posts/*",
          "/ko/dashboard",
          "/en/dashboard",
          "/ko/search",
          "/en/search"
        ],
      },
    ],
  },
};

module.exports = config;
