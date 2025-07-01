"use client";

import SearchInput from "./Search";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/routing";
import Takeoff from "@/app/icons/Takeoff";

export default function Header({
  postCount,
}: {
  postCount?: number;
}) {
  const t = useTranslations();

  return (
    <header className="fixed top-0 z-[999] w-full min-h-20 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Takeoff className="w-6 h-6" fill="white" stroke="white" />
            <Link
              href="/"
              className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {t('header.title')}
            </Link>
          </div>
          {/* Routes */}
          <div className="flex flex-row items-center justify-start flex-1 gap-3 pl-8">
            <Link
              href="/timeline"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-nowrap"
            >
              {t('banner.timeline.title')}
            </Link>
            <Link
              href="/benchmarking"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-nowrap"
            >
              {t('banner.benchmark.title')}
            </Link>
          </div>
          <div className="items-center gap-3 hidden md:flex">
            <Suspense>
              <SearchInput />
            </Suspense>
            <LanguageSwitcher />
            {postCount ? (
              <span className="px-3 py-1.5 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-full backdrop-blur-sm">
                {t('header.postCount', { count: postCount })}
              </span>
            ) : (
              <span className="px-3 py-1.5 text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 rounded-full backdrop-blur-sm">
                {t('header.postCount', { count: 0 })}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
