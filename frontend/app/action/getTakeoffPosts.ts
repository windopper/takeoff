'use server';

export async function getTakeoffPosts({ limit = 20, offset = 0 }: { limit?: number, offset?: number }) {
  const response = await fetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/posts?limit=${limit}&offset=${offset}`,
    {
      next: {
        revalidate: 360,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function getTakeoffPostCount() {
  const response = await fetch(
    `https://takeoff-backend.kamilereon.workers.dev/api/post-count`,
    {
      next: {
        revalidate: 360,
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
        revalidate: 360,
      },
    }
  );
  const data = await response.json();
  return data;
}
