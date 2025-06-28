"use client";

import Background from "./Background";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function BenchmarkBanner() {
  const t = useTranslations('banner.benchmark');

  return (
    <Link
      className="relative w-full h-24 overflow-hidden flex flex-col items-center justify-center bg-purple-800/20
        rounded-3xl cursor-pointer border-2 border-purple-800/20 shadow-2xl
        hover:border-purple-800/20 hover:shadow-purple-800/20 transition-all duration-150
    "
      href="/benchmarking"
    >
      <h1
        className="text-3xl text-purple-200/90 z-10
      text-shadow-[rgba(255, 255, 255, 0.5)]"
      >
        {t('title')}
      </h1>
      <p className="text-xs text-purple-100 z-10">
        {t('description')}
      </p>
      <Background className="absolute w-full h-128" />
    </Link>
  );
}


