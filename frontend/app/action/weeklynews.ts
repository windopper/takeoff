"use server";

import { BACKEND_URL } from "../constants";
import { takeoffFetch } from "@/utils/fetch";
import {
  TRANSLATED_WEEKLY_NEWS_BY_ID_TAG,
  WEEKLY_NEWS_ID_TAG,
  WEEKLY_NEWS_LATEST_TAG,
  WEEKLY_NEWS_LIST_TAG,
} from "../constants/tags";
import { WeeklyNewsPost } from "../types/weeklynews";

const mockWeeklyNewsList: WeeklyNewsPost[] = [
  {
    id: 1,
    title: "주간 AI 이슈 정리",
    content: "주간 AI 이슈 정리",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "주간 AI 이슈 정리",
    content: "주간 AI 이슈 정리",
    createdAt: new Date().toISOString(),
  },

  {
    id: 3,
    title: "주간 AI 이슈 정리",
    content: "주간 AI 이슈 정리",
    createdAt: new Date().toISOString(),
  },
];

export async function getWeeklyNewsList(language: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/weekly-news-list`, {
    method: "GET",
    next: {
      revalidate: 3600,
      tags: [WEEKLY_NEWS_LIST_TAG],
    },
  });

  const data = await response.json();

  if (language !== "ko") {
    const promises = data.map(async (weeklyNews: WeeklyNewsPost) => {
      const translatedWeeklyNews = await getTakeoffTranslatedWeeklyNewsById(
        weeklyNews.id.toString(),
        language
      );

      if (!translatedWeeklyNews) {
        return weeklyNews;
      }

      return {
        ...weeklyNews,
        title: translatedWeeklyNews.title,
        content: translatedWeeklyNews.content,
      };
    });
    const translatedWeeklyNewsList = await Promise.all(promises);
    return translatedWeeklyNewsList;
  }

  return data;
}

export async function getWeeklyNewsMockList(): Promise<WeeklyNewsPost[]> {
  return mockWeeklyNewsList;
}

export async function getWeeklyNews(id: string, language: string) {
  const response = await takeoffFetch(
    `${BACKEND_URL}/api/weekly-news?id=${id}`,
    {
      method: "GET",
      next: {
        // revalidate: 3600,
        tags: [WEEKLY_NEWS_ID_TAG(id)],
      },
    }
  );
  if (!response.ok) {
    return null;
  }
  const data = await response.json();

  if (language !== "ko") {
    const translatedWeeklyNews = await getTakeoffTranslatedWeeklyNewsById(
      id,
      language
    );
    if (translatedWeeklyNews) {
      return {
        ...data,
        title: translatedWeeklyNews.title,
        content: translatedWeeklyNews.content,
      };
    }
  }

  return data;
}

export async function getLatestWeeklyNews(language: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/weekly-news-latest`, {
    method: "GET",
    next: {
      revalidate: 3600,
      tags: [WEEKLY_NEWS_LATEST_TAG],
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (language !== "ko") {
    const translatedWeeklyNews = await getTakeoffTranslatedWeeklyNewsById(
      data.id,
      language
    );
    if (translatedWeeklyNews) {
      return {
        ...data,
        title: translatedWeeklyNews.title,
        content: translatedWeeklyNews.content,
      };
    }
  }

  return data;
}

export async function getTakeoffTranslatedWeeklyNewsById(
  id: string,
  language: string
) {
  const response = await takeoffFetch(
    `${BACKEND_URL}/api/translate-weekly-news-by-id?id=${id}&language=${language}`,
    {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: [TRANSLATED_WEEKLY_NEWS_BY_ID_TAG(id, language)],
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}
