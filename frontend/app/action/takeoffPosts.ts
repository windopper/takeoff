"use server";

import { takeoffFetch } from "@/utils/fetch";
import { revalidateTag } from "next/cache";
import {
  POSTS_TAG,
  POST_COUNT_TAG,
  TRANSLATED_POST_BY_ID_TAG,
  getPostByIdTag,
} from "../constants/tags";
import { BACKEND_URL } from "../constants";
import { Post } from "../types/post";

export async function getTakeoffPosts({
  limit = 20,
  offset = 0,
  query = "",
  category = "",
  language = "ko",
}: {
  limit?: number;
  offset?: number;
  query?: string;
  category?: string;
  language?: string;
}) {
  const response = await takeoffFetch(
    `${BACKEND_URL}/api/posts?limit=${limit}&offset=${offset}&q=${query}&category=${category}`,
    {
      next: {
        revalidate: 600,
        tags: [POSTS_TAG],
      },
    }
  );

  const data = await response.json();

  if (language !== "ko") {
    const promises = data.posts.map(async (post: Post) => {
      const translatedPost = await getTakeoffTranslatedPostById(
        post.id.toString(),
        language
      );
      if (!translatedPost) {
        return post;
      }
      return {
        ...post,
        title: translatedPost.title,
        content: translatedPost.content,
      };
    });
    const translatedPosts = await Promise.all(promises);
    return {
      posts: translatedPosts,
    };
  }

  return data;
}

export async function getTakeoffPostCount({
  query = "",
  category = "",
}: {
  query?: string;
  category?: string;
}) {
  const response = await takeoffFetch(
    `${BACKEND_URL}/api/post-count?q=${query}&category=${category}`,
    {
      next: {
        revalidate: 600,
        tags: [POST_COUNT_TAG],
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function getTakeoffPostById(id: string, language: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/posts/${id}`, {
    next: {
      revalidate: 3600,
      tags: [getPostByIdTag(id)],
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (language !== "ko") {
    const translatedPost = await getTakeoffTranslatedPostById(id, language);
    if (translatedPost) {
      return {
        ...data.post,
        title: translatedPost.title,
        content: translatedPost.content,
      };
    }
  }

  return data.post;
}

export async function getTakeoffTranslatedPostById(
  id: string,
  language: string
) {
  const response = await takeoffFetch(
    `${BACKEND_URL}/api/translate-post-by-id?id=${id}&language=${language}`,
    {
      next: {
        revalidate: 3600,
        tags: [TRANSLATED_POST_BY_ID_TAG(id, language)],
      },
    }
  );
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
}

export async function deleteTakeoffPostById(id: string) {
  const response = await takeoffFetch(`${BACKEND_URL}/api/posts/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  revalidateTag(POSTS_TAG);
  revalidateTag(POST_COUNT_TAG);
  revalidateTag(getPostByIdTag(id));
  return data;
}
