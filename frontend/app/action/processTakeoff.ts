'use server';

import { takeoffFetch } from "@/utils/fetch";

export const processArxivPaper = async (url: string) => {
    try {
        const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-arxiv`, {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
        
        if (!response.ok) {
            let errorMessage = 'ArXiv 논문 처리에 실패했습니다';
            try {
                const errorData = await response.json();
                if (errorData.error || errorData.message) {
                    errorMessage = errorData.error || errorData.message;
                }
            } catch {
                // JSON 파싱 실패 시 기본 메시지 사용
                errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('ArXiv 논문 처리 중 알 수 없는 오류가 발생했습니다');
    }
}

export const processRedditPosts = async (url: string) => {
    try {
        const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-reddit`, {
            method: 'POST',
        });
        
        if (!response.ok) {
            let errorMessage = 'Reddit 포스트 처리에 실패했습니다';
            try {
                const errorData = await response.json();
                if (errorData.error || errorData.message) {
                    errorMessage = errorData.error || errorData.message;
                }
            } catch {
                // JSON 파싱 실패 시 기본 메시지 사용
                errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Reddit 포스트 처리 중 알 수 없는 오류가 발생했습니다');
    }
}

export const processHackerNewsPosts = async (url: string) => {
    try {
        const response = await takeoffFetch(`https://takeoff-backend.kamilereon.workers.dev/api/process-hackernews`, {
            method: 'POST',
        });
        
        if (!response.ok) {
            let errorMessage = 'HackerNews 포스트 처리에 실패했습니다';
            try {
                const errorData = await response.json();
                if (errorData.error || errorData.message) {
                    errorMessage = errorData.error || errorData.message;
                }
            } catch {
                // JSON 파싱 실패 시 기본 메시지 사용
                errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('HackerNews 포스트 처리 중 알 수 없는 오류가 발생했습니다');
    }
}