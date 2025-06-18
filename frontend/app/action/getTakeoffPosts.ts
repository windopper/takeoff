"use server";

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
  const response = await fetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts?limit=${limit}&offset=${offset}&q=${query}&category=${category}`,
    {
      next: {
        revalidate: 600,
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
  const response = await fetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/post-count?q=${query}&category=${category}`,
    {
      next: {
        revalidate: 600,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function getTakeoffPostById(id: string) {
  const response = await fetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts/${id}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  const data = await response.json();
  return data;
}
