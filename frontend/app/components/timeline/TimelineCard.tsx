import LucideExternalLink from "@/app/icons/LucideExternalLink";
import Link from "next/link";
import { CATEGORIES } from "@/data/timelineData";
import { useState } from "react";

interface TimelineCardProps {
    title: string;
    description: string;
    category: CATEGORIES;
    link: string;
    date: string;
    isFocused?: boolean;
}

const CATEGORY_MAP = {
    [CATEGORIES.MODEL_RELEASE]: "Model Release",
    [CATEGORIES.CULTURE]: "Culture & Society",
    [CATEGORIES.BUSINESS]: "Business & Industry",
    [CATEGORIES.RESEARCH]: "Research & Development",
    [CATEGORIES.POLICY]: "Policy & Regulation",
}

const CATEGORY_COLORS = {
    [CATEGORIES.MODEL_RELEASE]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [CATEGORIES.CULTURE]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    [CATEGORIES.BUSINESS]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [CATEGORIES.RESEARCH]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [CATEGORIES.POLICY]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

export default function TimelineCard({ title, description, category, link, date, isFocused = false }: TimelineCardProps) {
    return (
      <div className={`
        relative group w-full sm:max-w-xl min-h-32 sm:min-h-48 rounded-xl shadow-sm border transition-all duration-300 ease-out
        overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 
        ${isFocused 
          ? 'border-zinc-300/50 dark:border-zinc-600/50 bg-zinc-50/80 dark:bg-zinc-900/80 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800/50 scale-[1.02] -translate-y-1' 
          : 'border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:shadow-zinc-200/30 dark:hover:shadow-zinc-800/30'
        }
      `}
      >
        {/* 상단 메타데이터 영역 */}
        <div className="flex items-center justify-between p-4 pb-2">
          <time className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
            {date}
          </time>
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium tracking-tight not-sm:hidden
            ${CATEGORY_COLORS[category]}
          `}>
            {CATEGORY_MAP[category]}
          </span>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="px-4 pb-4 flex flex-col">
          <Link 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group/link flex items-start gap-2 mb-2 transition-colors duration-200"
          >
            <h1 className="text-lg font-medium leading-tight text-zinc-900 dark:text-zinc-100 
            line-clamp-2 font-[MaruBuri] relative group-hover/link:text-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              <span className="relative">
                {title}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white dark:bg-white 
                transition-all duration-300 ease-out group-hover/link:w-full"></span>
              </span>
            </h1>
            <LucideExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover/link:text-white dark:group-hover/link:text-white transition-colors duration-200 flex-shrink-0 mt-0.5" />
          </Link>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide sm:hidden">
              {CATEGORY_MAP[category]}
          </span>
          
          <div 
            className={`text-sm text-zinc-700 mt-1 dark:text-zinc-400 leading-relaxed flex-1`} 
            dangerouslySetInnerHTML={{ __html: description }} 
          />
        </div>
      </div>
    );
}