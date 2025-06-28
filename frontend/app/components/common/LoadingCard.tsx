"use client";

import { useTranslations } from "next-intl";

interface LoadingCardProps {
  height?: string;
  className?: string;
  loadingText?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export default function LoadingCard({ 
  height = "h-24", 
  className = "", 
  loadingText,
  variant = 'default' 
}: LoadingCardProps) {
  const t = useTranslations('common');
  const displayText = loadingText || t('loading');

  if (variant === 'minimal') {
    return (
      <div className={`${height} bg-zinc-800/30 rounded-xl animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-zinc-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`${height} bg-zinc-800/40 rounded-2xl ${className}`}>
        <div className="flex items-center justify-center h-full space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-600 border-t-zinc-400"></div>
          <span className="text-sm text-zinc-400">{displayText}</span>
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div className={`w-full ${height} bg-zinc-800/50 rounded-3xl mb-6 ${className}`}>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-3">
          {/* 로딩 스피너 */}
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-700 border-t-zinc-400"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-8 w-8 border-4 border-transparent border-t-zinc-300/50"></div>
          </div>
          
          {/* 로딩 텍스트 */}
          <p className="text-sm text-zinc-400 animate-pulse">
            {displayText}
          </p>
          
          {/* 장식용 도트들 */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 