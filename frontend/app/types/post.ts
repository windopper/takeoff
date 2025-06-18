export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    post_score: number;
    originTitle: string;
    originalUrl: string;
    originalAuthor: string;
    author: string;
    category: string;
    community: string;
    platform: string;
}