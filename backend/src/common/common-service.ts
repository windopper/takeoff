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
import { logError, logInfo, logSuccess } from "../log/log-stream-service";

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

const SERVICE_TAG = "common";
const OPERATION_TAG = "processPosts";

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

    logInfo(`Processing posts: ${results.length}`, SERVICE_TAG, OPERATION_TAG);

    for (const result of results) {
        console.log('\n');
        logInfo(`Processing post: ${result.url}`, SERVICE_TAG, OPERATION_TAG);
        try {
            const isPostExists = await postManager.isPostExists(result.url);
            if (isPostExists) {
                console.log(`Post already exists: ${result.url}`);
                logInfo(`Post already exists: ${result.url}`, SERVICE_TAG, OPERATION_TAG);
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
                logInfo(`Post filtered: ${result.url} - ${filtered.reason}`, SERVICE_TAG, OPERATION_TAG);
                continue;
            }

            let similarPosts: AiPost[] = [];
    
            if (config.vectorize) {
                logInfo(`Retrieve similar posts...`, SERVICE_TAG, OPERATION_TAG);
                similarPosts = await retrieveSimilarPosts(result.title);
                logInfo(`Found ${similarPosts.length} similar posts`, SERVICE_TAG, OPERATION_TAG);
            }

            const processedPost = await writer.processPost(result, similarPosts.map((post) => post.content));
            logInfo(`Processed post: ${processedPost.title}`, SERVICE_TAG, OPERATION_TAG);
            const savedPost = await postManager.savePost(processedPost);
            if (savedPost) {
                if (config.vectorize) {
                    await vectorizePostAndSave(savedPost);
                    logInfo(`Vectorized post`, SERVICE_TAG, OPERATION_TAG);
                }
                statistics.saved++;
                logSuccess(`Saved post: ${savedPost.title}`, SERVICE_TAG, OPERATION_TAG);

                if (config.webhook) {
                    await WebhookService.sendWebhookBatchToSubscribers([{
                        title: processedPost.title,
                        content: processedPost.content,
                        url: `${FRONTEND_URL}/posts/${savedPost}`,
                    }]);
                    logInfo(`Sent webhook to subscribers`, SERVICE_TAG, OPERATION_TAG);
                } else {
                    logInfo(`Webhook disabled`, SERVICE_TAG, OPERATION_TAG);
                }
            }
        } catch (error) {
            if (error instanceof XmlParseError) {
                logError(`Error parsing XML: ${error}`, SERVICE_TAG, OPERATION_TAG);
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
                logError(`Error processing post: ${error}`, SERVICE_TAG, OPERATION_TAG);
                statistics.skipped++;
            }
        }

    }

    return statistics;
}