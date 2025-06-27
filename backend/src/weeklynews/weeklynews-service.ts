import { env } from "cloudflare:workers";
import { WeeklyNewsPost } from "../db/schema";
import { WeeklyNewsManager } from "../manager/weekly-news-manager";
import { PostManager } from "../manager/post-manager";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import {
    RunnableSequence,
  } from '@langchain/core/runnables';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { AiPost } from '../db/schema';
import { WEEKLY_NEWS_SELECTION_PROMPT } from "../prompts/weekly-news-selection-prompt";
import { WEEKLY_NEWS_BLOG_PROMPT, WEEKLY_NEWS_BLOG_PROMPT_V2 } from "../prompts/weekly-news-blog-prompt";
import { FRONTEND_URL } from "../constants";

export class WeeklyNewsService {
    private static gemini: ChatGoogleGenerativeAI = new ChatGoogleGenerativeAI({
        apiKey: env.GEMINI_API_KEY,
        model: 'gemini-2.5-flash-preview-05-20',
        temperature: 0.4,
    });

    private static claude: ChatAnthropic = new ChatAnthropic({
        apiKey: env.CLAUDE_API_KEY,
        model: 'claude-sonnet-4-20250514',
        temperature: 0.4,
        maxTokens: 8000,
    });
    
    static async getWeeklyNewsList(): Promise<WeeklyNewsPost[]> {
        const weeklyNewsManager = new WeeklyNewsManager(env.DB);
        const posts = await weeklyNewsManager.getAllPosts();
        return posts;
    }

    static async getWeeklyNews(id: number): Promise<WeeklyNewsPost | null> {
        const weeklyNewsManager = new WeeklyNewsManager(env.DB);
        const post = await weeklyNewsManager.getPost(id);
        return post || null;
    }

    private static formatPostsForSelection(posts: AiPost[]): string {
        return posts
            .map(
                (post) => `
ID: ${post.id}
Title: ${post.originalTitle}
Content: ${post.content}
Score: ${post.postScore}
Platform: ${post.platform}
Community: ${post.community}
URL: ${post.originalUrl}
`
            )
            .join('--- \n');
    }

    static async createWeeklyNews(title: string): Promise<string> {
        console.log('--- Starting Weekly News Creation ---');
        const weeklyNewsManager = new WeeklyNewsManager(env.DB);
        const postManager = new PostManager(env.DB);
        const posts = await postManager.getPostAfterDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        console.log(`[1/5] Fetched ${posts.length} posts from the last 7 days.`);

        const formattedPosts = WeeklyNewsService.formatPostsForSelection(posts);
        console.log('[2/5] Formatted posts for AI analysis.');

        const selectionParser = new JsonOutputParser();

        const selectionChain = RunnableSequence.from([
            WEEKLY_NEWS_SELECTION_PROMPT,
            this.gemini,
            selectionParser,
        ]);

        const blogChain = RunnableSequence.from([
            {
                events: (input: any) => JSON.stringify(input.events, null, 2),
                title: (input: any) => input.title,
            },
            WEEKLY_NEWS_BLOG_PROMPT_V2,
            this.claude,
            (output: any) => output.content,
        ]);


        console.log('[3/5] Invoking Gemini for event selection...');
        const selectionResult: any = await selectionChain.invoke({ posts: formattedPosts });
        console.log('[4/5] Gemini selection complete. Selected events:', JSON.stringify(selectionResult.events, null, 2));


        console.log('[5/5] Invoking Claude for blog generation...');
        const blogContent = await blogChain.invoke({
            events: selectionResult.events,
            title: title,
        });
        console.log('--- Weekly News Creation Finished ---');
        console.log('Generated Blog Content Snippet:', (blogContent as string).substring(0, 200) + '...');

        console.log('--- Creating Weekly News Post ---');
        const newPostId = await weeklyNewsManager.createPost(title, blogContent as string);
        const newPost = await weeklyNewsManager.getPost(newPostId);

        if (!newPost) {
            throw new Error("Failed to retrieve the newly created weekly news post.");
        }

        // revalidate cache
        try {
            await this.revalidateCache(newPostId);
        } catch (error) {
            console.error('Failed to revalidate cache:', error);
        }

        return blogContent;
    }

    static async deleteWeeklyNews(id: number) {
        const weeklyNewsManager = new WeeklyNewsManager(env.DB);
        await weeklyNewsManager.deletePost(id);
        await this.revalidateCache(id);
    }

    static async revalidateCache(id: number) {
        try {
            await fetch(`${FRONTEND_URL}/api/cache/weeklynews`, {
                method: 'POST',
                body: JSON.stringify({ id: id }),
            });
        } catch (error) {
            console.error('Failed to revalidate cache:', error);
        }
    }

    static async getLatestWeeklyNews(): Promise<WeeklyNewsPost | null> {
        const weeklyNewsManager = new WeeklyNewsManager(env.DB);
        const post = await weeklyNewsManager.getLatestPost();
        return post || null;
    }
}