"use server";

import { takeoffFetch } from "@/utils/fetch";
import { revalidateTag } from "next/cache";
import { POSTS_TAG, POST_COUNT_TAG, getPostByIdTag } from "../constants/tags";

export async function getTakeoffPosts({
  limit = 20,
  offset = 0,
  query = "",
  category = "",
}: {
  limit?: number;
  offset?: number;
  query?: string;
  category?: string;
}) {
  const response = await takeoffFetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts?limit=${limit}&offset=${offset}&q=${query}&category=${category}`,
    {
      next: {
        revalidate: 600,
        tags: [POSTS_TAG],
      },
    }
  );
  const data = await response.json();
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
    `https://takeoff-backend.kamilereon.workers.dev/api/post-count?q=${query}&category=${category}`,
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

export async function getTakeoffPostById(id: string) {
  const response = await takeoffFetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts/${id}`,
    {
      next: {
        revalidate: 3600,
        tags: [getPostByIdTag(id)],
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function deleteTakeoffPostById(id: string) {
  const response = await takeoffFetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts/${id}`,
    {
      method: 'DELETE',
    }
  );
  const data = await response.json();
  revalidateTag(POSTS_TAG);
  revalidateTag(POST_COUNT_TAG);
  revalidateTag(getPostByIdTag(id));
  return data;
}
