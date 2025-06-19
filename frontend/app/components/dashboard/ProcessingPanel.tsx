'use client';

import { useState } from 'react';
import { processArxivPaper, processRedditPosts, processHackerNewsPosts } from '../../action/processTakeoff';

type ProcessingState = {
  arxiv: boolean;
  reddit: boolean;
  hackernews: boolean;
};

export default function ProcessingPanel() {
  const [arxivUrl, setArxivUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState<ProcessingState>({
    arxiv: false,
    reddit: false,
    hackernews: false,
  });
  const [results, setResults] = useState<Record<string, any>>({});

  const handleArxivProcess = async () => {
    if (!arxivUrl.trim()) return;
    
    setIsProcessing((prev: ProcessingState) => ({ ...prev, arxiv: true }));
    try {
      const result = await processArxivPaper(arxivUrl);
      setResults((prev: Record<string, any>) => ({ ...prev, arxiv: result }));
    } catch (error) {
      console.error('ArXiv processing error:', error);
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, arxiv: false }));
    }
  };

  const handleRedditProcess = async () => {
    setIsProcessing((prev: ProcessingState) => ({ ...prev, reddit: true }));
    try {
      const result = await processRedditPosts('');
      setResults((prev: Record<string, any>) => ({ ...prev, reddit: result }));
    } catch (error) {
      console.error('Reddit processing error:', error);
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, reddit: false }));
    }
  };

  const handleHackerNewsProcess = async () => {
    setIsProcessing((prev: ProcessingState) => ({ ...prev, hackernews: true }));
    try {
      const result = await processHackerNewsPosts('');
      setResults((prev: Record<string, any>) => ({ ...prev, hackernews: result }));
    } catch (error) {
      console.error('HackerNews processing error:', error);
    } finally {
      setIsProcessing((prev: ProcessingState) => ({ ...prev, hackernews: false }));
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
          {results.arxiv && (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">처리 완료: {JSON.stringify(results.arxiv)}</p>
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
          {results.reddit && (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">처리 완료: {JSON.stringify(results.reddit)}</p>
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
          {results.hackernews && (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-md">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">처리 완료: {JSON.stringify(results.hackernews)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 