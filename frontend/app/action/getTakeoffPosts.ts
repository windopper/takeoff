export async function getTakeoffPosts() {
  const response = await fetch(
    "https://takeoff-backend.kamilereon.workers.dev/api/posts",
    {
      next: {
        revalidate: 3600,
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
