export const POSTS_TAG = 'takeoff-posts';
export const getPostByIdTag = (id: string) => `takeoff-post-by-id-${id}`;
export const POST_COUNT_TAG = 'takeoff-post-count';
export const TRANSLATED_POST_BY_ID_TAG = (id: string, language: string) => `takeoff-translated-post-by-id-${id}-${language}`;

export const WEEKLY_NEWS_LIST_TAG = 'weekly-news-list';
export const WEEKLY_NEWS_ID_TAG = (id: string) => `weekly-news-id-${id}`;
export const WEEKLY_NEWS_LATEST_TAG = 'weekly-news-latest'; 
export const TRANSLATED_WEEKLY_NEWS_BY_ID_TAG = (id: string, language: string) => `weekly-news-translated-by-id-${id}-${language}`;