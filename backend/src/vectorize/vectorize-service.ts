import { GoogleGenAI } from "@google/genai";
import { env } from "cloudflare:workers";
import { PostManager } from "../manager/post-manager";
import { AiPost } from "../db/schema";
import { VECTORIZE_DELAY } from "../constants";

export async function vectorizeText(text: string) {
    const embeddings = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
    })

    const vector = await embeddings.models.embedContent({
        model: "gemini-embedding-exp-03-07",
        contents: text,
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: 1536,
        }
    });

    if (!vector.embeddings) {
        throw new Error('Failed to vectorize text');
    }

    return vector.embeddings[0].values;
}

export async function vectorizeTextBatch(texts: string[]) {
    const embeddings = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
    })
    
    const vectors = await embeddings.models.embedContent({
        model: "gemini-embedding-exp-03-07",
        contents: texts,
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: 1536,
        }
    });

    if (!vectors.embeddings) {
        throw new Error('Failed to vectorize text');
    }

    if (!vectors.embeddings.every((embedding) => embedding.values)) {
        throw new Error('Failed to vectorize text');
    }

    return vectors.embeddings.map((embedding) => embedding.values!);
}

export async function vectorizePostAndSave(post: AiPost) {
    const postManager = new PostManager(env.DB);
    const vector = await vectorizeText(post.content);

    if (!vector) {
        throw new Error('Failed to vectorize text');
    }

    try {
        const inserted = await env.VECTORIZE.insert([{
            id: post.id.toString(),
            values: vector,
            metadata: {
                postId: post.id,
            }
        }]);
    
        if (!inserted) {
            throw new Error('Failed to save vectorized post');
        }
    
        await postManager.updatePost(post.id, {
            isVectorized: 1,
        });
    } catch (error) {
        console.log("Failed to save vectorized post", error);
        await env.VECTORIZE.deleteByIds([post.id.toString()]);
        await postManager.updatePost(post.id, {
            isVectorized: 0,
        });
    }
}

export async function vectorizePostBatchAndSave(posts: AiPost[]) {
    const postManager = new PostManager(env.DB);
    const texts = posts.map((post) => post.content);
    const vectors = await vectorizeTextBatch(texts);
    const inserted = await env.VECTORIZE.insert(vectors.map((vector, index) => ({
        id: posts[index].id.toString(),
        values: vector,
        metadata: {
            postId: posts[index].id,
        }
    })));

    if (!inserted) {
        throw new Error('Failed to save vectorized posts');
    }

    await Promise.all(posts.map((post) => postManager.updatePost(post.id, {
        isVectorized: 1,
    })));
}

export async function vectorizeAllPostNotIndexedAndSaveInBatch() {
    const postManager = new PostManager(env.DB);
    const posts = await postManager.getAllPostNotVectorized();
    await vectorizePostBatchAndSave(posts);
}

export async function vectorizeAllPostNotIndexedAndSave() {
    const postManager = new PostManager(env.DB);
    const posts = await postManager.getAllPostNotVectorized();
    console.log(`Need to vectorize ${posts.length} posts`);
    for (const post of posts) {
        console.log(`Vectorizing post ${post.id}`);
        await vectorizePostAndSave(post);
        // delay 1 second
        await new Promise((resolve) => setTimeout(resolve, VECTORIZE_DELAY));
        console.log(`Vectorized post ${post.id}`);
    }
}

export async function retrieveSimilarPosts(query: string): Promise<AiPost[]> {
    const postManager = new PostManager(env.DB);

    const embeddings = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY,
    })

    const vector = await embeddings.models.embedContent({
        model: "gemini-embedding-exp-03-07",
        contents: query,
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: 1536,
        }
    });
    
    if (!vector.embeddings) {
        throw new Error('Failed to vectorize text');
    }

    const result = await env.VECTORIZE.query(vector.embeddings[0].values!, {
        topK: 3,
        returnValues: true,
        returnMetadata: true,
    });

    if (!result) {
        throw new Error('Failed to query vectorize');
    }

    const threshold = 0.5;
    
    const postIds = result.matches
			.filter((match) => match.metadata?.postId && match.score && match.score > threshold)
			.map((match) => match.metadata?.postId!.toString()) as string[];
    const posts = await postManager.getPostsByIds(postIds);
    return posts;
}