'use client';

import { useState } from 'react';
import { processArxivPaper, processRedditPosts, processHackerNewsPosts, processUrl } from '../../action/processTakeoff';

type ProcessingState = {
  arxiv: boolean;
  reddit: boolean;
  hackernews: boolean;
  url: boolean;
};

type ErrorState = {
  arxiv: string | null;
  reddit: string | null;
  hackernews: string | null;
  url: string | null;
};

export default function ProcessingPanel() {
  const [arxivUrl, setArxivUrl] = useState('');
  const [generalUrl, setGeneralUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState<ProcessingState>({
    arxiv: false,
    reddit: false,
    hackernews: false,
    url: false,
  });
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ErrorState>({
    arxiv: null,
    reddit: null,
    hackernews: null,
    url: null,
  });

  const handleArxivProcess = async () => {
    if (!arxivUrl.trim()) return;
    
    setIsProcessing((prev: ProcessingState) => ({ ...prev, arxiv: true }));
    setErrors((prev: ErrorState) => ({ ...prev, arxiv: null }));
    try {
      const result = await processArxivPaper(arxivUrl);
      setResults((prev: Record<string, any>) => ({ ...prev, arxiv: result }));
    } catch (error) {
      console.error('ArXiv processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'ArXiv 처리 중 오류가 발생했습니다.';
      setErrors((prev: ErrorState) => ({ ...prev, arxiv: errorMessage }));
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, arxiv: false }));
    }
  };

  const handleRedditProcess = async () => {
    setIsProcessing((prev: ProcessingState) => ({ ...prev, reddit: true }));
    setErrors((prev: ErrorState) => ({ ...prev, reddit: null }));
    try {
      const result = await processRedditPosts('');
      setResults((prev: Record<string, any>) => ({ ...prev, reddit: result }));
    } catch (error) {
      console.error('Reddit processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Reddit 처리 중 오류가 발생했습니다.';
      setErrors((prev: ErrorState) => ({ ...prev, reddit: errorMessage }));
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, reddit: false }));
    }
  };

  const handleHackerNewsProcess = async () => {
    setIsProcessing((prev: ProcessingState) => ({ ...prev, hackernews: true }));
    setErrors((prev: ErrorState) => ({ ...prev, hackernews: null }));
    try {
      const result = await processHackerNewsPosts('');
      setResults((prev: Record<string, any>) => ({ ...prev, hackernews: result }));
    } catch (error) {
      console.error('HackerNews processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'HackerNews 처리 중 오류가 발생했습니다.';
      setErrors((prev: ErrorState) => ({ ...prev, hackernews: errorMessage }));
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, hackernews: false }));
    }
  };

  const handleUrlProcess = async () => {
    if (!generalUrl.trim()) return;
    
    setIsProcessing((prev: ProcessingState) => ({ ...prev, url: true }));
    setErrors((prev: ErrorState) => ({ ...prev, url: null }));
    try {
      const result = await processUrl(generalUrl);
      setResults((prev: Record<string, any>) => ({ ...prev, url: result }));
    } catch (error) {
      console.error('URL processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'URL 처리 중 오류가 발생했습니다.';
      setErrors((prev: ErrorState) => ({ ...prev, url: errorMessage }));
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, url: false }));
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">콘텐츠 처리</h2>
      
      <div className="space-y-6">
        {/* ArXiv 처리 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">ArXiv 논문 처리</h3>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="ArXiv URL을 입력하세요"
              value={arxivUrl}
              onChange={(e) => setArxivUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
            <button
              onClick={handleArxivProcess}
              disabled={isProcessing.arxiv || !arxivUrl.trim()}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing.arxiv ? '처리 중...' : '처리하기'}
            </button>
          </div>
          {errors.arxiv && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">❌ {errors.arxiv}</p>
            </div>
          )}
          {results.arxiv && !errors.arxiv && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">✅ 처리 완료: {JSON.stringify(results.arxiv)}</p>
            </div>
          )}
        </div>

        {/* 일반 URL 처리 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">일반 URL 처리</h3>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="처리할 URL을 입력하세요"
              value={generalUrl}
              onChange={(e) => setGeneralUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
            <button
              onClick={handleUrlProcess}
              disabled={isProcessing.url || !generalUrl.trim()}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing.url ? '처리 중...' : '처리하기'}
            </button>
          </div>
          {errors.url && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">❌ {errors.url}</p>
            </div>
          )}
          {results.url && !errors.url && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">✅ 처리 완료: {JSON.stringify(results.url)}</p>
            </div>
          )}
        </div>

        {/* Reddit 처리 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reddit 포스트 처리</h3>
          <button
            onClick={handleRedditProcess}
            disabled={isProcessing.reddit}
            className="w-full px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing.reddit ? '처리 중...' : 'Reddit 포스트 처리하기'}
          </button>
          {errors.reddit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">❌ {errors.reddit}</p>
            </div>
          )}
          {results.reddit && !errors.reddit && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">✅ 처리 완료: {JSON.stringify(results.reddit)}</p>
            </div>
          )}
        </div>

        {/* HackerNews 처리 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">HackerNews 포스트 처리</h3>
          <button
            onClick={handleHackerNewsProcess}
            disabled={isProcessing.hackernews}
            className="w-full px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing.hackernews ? '처리 중...' : 'HackerNews 포스트 처리하기'}
          </button>
          {errors.hackernews && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">❌ {errors.hackernews}</p>
            </div>
          )}
          {results.hackernews && !errors.hackernews && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">✅ 처리 완료: {JSON.stringify(results.hackernews)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 