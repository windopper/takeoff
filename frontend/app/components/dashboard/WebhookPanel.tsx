'use client';

import { useState, useEffect } from 'react';
import { registerWebhook, getWebhookList, deleteWebhookUrl } from '../../action/webhook';

export default function WebhookPanel() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhooks, setWebhooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      const result = await getWebhookList();
      console.log(result);
      setWebhooks(result.webhookList || []);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterWebhook = async () => {
    if (!webhookUrl.trim()) return;

    setIsRegistering(true);
    try {
      await registerWebhook(webhookUrl);
      setWebhookUrl('');
      await loadWebhooks();
    } catch (error) {
      console.error('Failed to register webhook:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteWebhookUrl(id);
      await loadWebhooks();
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">웹훅 관리</h2>
      
      {/* 웹훅 등록 */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">새 웹훅 등록</h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="웹훅 URL을 입력하세요"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
          />
          <button
            onClick={handleRegisterWebhook}
            disabled={isRegistering || !webhookUrl.trim()}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-600 text-white text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-500 disabled:bg-zinc-400 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
          >
            {isRegistering ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>

      {/* 웹훅 목록 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">등록된 웹훅</h3>
          <button
            onClick={loadWebhooks}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '로딩 중...' : '새로고침'}
          </button>
        </div>

        {webhooks.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-md">
            등록된 웹훅이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {webhooks.map((webhook) => (
              <div
                key={webhook}
                className="flex items-center justify-between p-3 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {webhook}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteWebhook(webhook)}
                  className="ml-3 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 