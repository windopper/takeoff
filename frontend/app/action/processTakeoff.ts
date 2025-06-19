import { takeoffFetch } from "@/utils/fetch";

export const processArxivPaper = async (url: string) => {
    const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-arxiv`, {
        method: 'POST',
        body: JSON.stringify({ url }),
    });
    const data = await response.json();
    return data;
}

export const processRedditPosts = async (url: string) => {
    const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-reddit`, {
        method: 'POST',
    });
    const data = await response.json();
    return data;
}

export const processHackerNewsPosts = async (url: string) => {
    const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-hackernews`, {
        method: 'POST',
    });
    const data = await response.json();
    return data;
}