import { env } from "cloudflare:workers";
import { PostManager } from "../manager/post-manager";
import { ArticleAIWriter } from "./article-ai-writer";
import { CommonFetcher } from "./common-fetcher";
import { CommonParser } from "./common-parser";
import { CommonFilter } from "./common-filter";
import { FilteredPostManager } from "../manager/filter-post-manager";
import { retrieveSimilarPosts, vectorizePostAndSave } from "../vectorize/vectorize-service";
import { CommonAIWriter } from "./common-ai-writer";
import { XmlParseError } from "../exceptions/xml-parse-error";
import { WebhookService } from "../webhook/webhook-service";
import { FRONTEND_URL } from "../constants";
import { AiPost } from "../db/schema";

export async function processUrl(url: string) {
    const postManager = new PostManager(env.DB);
    const writer = new ArticleAIWriter({
        geminiApiKey: env.GEMINI_API_KEY,
    });

    const isPostExists = await postManager.isPostExists(url);
    if (isPostExists) {
        throw new Error('Post already exists');
    }

    const processedPost = await writer.processPost(url);
    const savedPost = await postManager.savePost(processedPost);
    return savedPost;
}

export interface Statistics {
    total: number;
    filtered: number;
    saved: number;
    skipped: number;
}

export async function processPosts(data: {
    url: string;
    platform: string;
    community: string;
}, fetcher: CommonFetcher, parser: CommonParser, filter: CommonFilter, writer: CommonAIWriter, config: {
    vectorize?: boolean;
    webhook?: boolean;
} = {
    vectorize: true,
    webhook: true,
}) {
    const postManager = new PostManager(env.DB);
    const filterManager = new FilteredPostManager(env.DB);
    const response = await fetcher.fetch(data.url);
    const text = await response.text();
    const results = parser.parse(text);

    const statistics: Statistics = {
        total: results.length,
        filtered: 0,
        saved: 0,
        skipped: 0,
    }

    for (const result of results) {
        console.log('\n')
        try {
            const isPostExists = await postManager.isPostExists(result.url);
            if (isPostExists) {
                console.log(`Post already exists: ${result.url}`);
                statistics.skipped++;
                continue;
            }
    
            const filtered = await filter.filterAll(result);
    
            if (!filtered.shouldProcess) {
                console.log(`Post filtered: ${result.url} - ${filtered.reason}`);
                if (filtered.reason === "ai_relevance" && filtered.aiReason) {
                    await filterManager.saveFilteredPost({
                        originalUrl: result.url,
                        originalTitle: result.title,
                        platform: data.platform,
                        community: data.community,
                        filterReason: filtered.aiReason,
                        filterType: filtered.reason
                    });
                }
                statistics.filtered++;
                continue;
            }

            let similarPosts: AiPost[] = [];
    
            if (config.vectorize) {
                console.log("Retrieve similar posts...");
                similarPosts = await retrieveSimilarPosts(result.title);
                console.log(`Found ${similarPosts.length} similar posts`);
            }

            console.log("Process post... ", result.title);
            const processedPost = await writer.processPost(result, similarPosts.map((post) => post.content));
            console.log(`Processed post: ${processedPost.title}`);
            const savedPost = await postManager.savePost(processedPost);
            if (savedPost) {
                console.log(`Saved post: ${savedPost.title}`);
                if (config.vectorize) {
                    await vectorizePostAndSave(savedPost);
                    console.log("Vectorized post");
                }
                statistics.saved++;

                if (config.webhook) {
                    await WebhookService.sendWebhookBatchToSubscribers([{
                        title: processedPost.title,
                        content: processedPost.content,
                        url: `${FRONTEND_URL}/posts/${savedPost}`,
                    }]);
                }
            }
        } catch (error) {
            if (error instanceof XmlParseError) {
                console.error('Error parsing XML:', error);
                statistics.skipped++;
                await filterManager.saveFilteredPost({
                    community: data.community,
                    filterReason: 'xml_parse_error',
                    filterType: 'xml_parse_error',
                    originalUrl: result.url,
                    originalTitle: result.title,
                    platform: data.platform,
                });
            } else {
                console.error('Error processing post:', error);
                statistics.skipped++;
            }
        }

    }

    return statistics;
}