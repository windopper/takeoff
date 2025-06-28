import { env } from 'cloudflare:workers';
import { Env } from '..';
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
import { TranslateService } from "../translate/translate-service";

export async function processUrl(env: Env, url: string) {
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
    translate?: boolean;
} = {
    vectorize: true,
    webhook: true,
    translate: true,
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
    
            // 필터링 된 포스트를 처리하지 않음
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
    
            // 유사 포스트 찾기
            if (config.vectorize) {
                logInfo(`Retrieve similar posts...`, SERVICE_TAG, OPERATION_TAG);
                similarPosts = await retrieveSimilarPosts(result.title);
                logInfo(`Found ${similarPosts.length} similar posts`, SERVICE_TAG, OPERATION_TAG);
            }

            // 포스트 처리
            const processedPost = await writer.processPost(result, similarPosts.map((post) => post.content));
            logInfo(`Processed post: ${processedPost.title}`, SERVICE_TAG, OPERATION_TAG);
            const savedPost = await postManager.savePost(processedPost);
            if (savedPost) {
                // 벡터화
                if (config.vectorize) {
                    await vectorizePostAndSave(savedPost);
                    logInfo(`Vectorized post`, SERVICE_TAG, OPERATION_TAG);
                }
                statistics.saved++;
                logSuccess(`Saved post: ${savedPost.title}`, SERVICE_TAG, OPERATION_TAG);

                // 번역
                if (config.translate) {
                    await TranslateService.translateAndSaveAiPost(savedPost.id, 
                        { title: savedPost.title, content: savedPost.content }, 'en', true);
                    logInfo(`Translated post`, SERVICE_TAG, OPERATION_TAG);
                }

                // 웹훅
                if (config.webhook) {
                    await WebhookService.sendWebhookBatchToSubscribers([{
                        title: processedPost.title,
                        content: processedPost.content,
                        url: `${FRONTEND_URL}/posts/${savedPost.id}`,
                    }]);
                    logInfo(`Sent webhook to subscribers`, SERVICE_TAG, OPERATION_TAG);
                } else {
                    logInfo(`Webhook disabled`, SERVICE_TAG, OPERATION_TAG);
                }
            }
        } catch (error) {
            // XML 파싱 오류 처리
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