import { TimelineSvg } from "./TimelineSvg";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function TimelineBanner({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'banner.timeline' });

  return (
    <Link
      className="relative w-full h-24 overflow-hidden flex flex-col items-center justify-center bg-indigo-800/20
        rounded-3xl cursor-pointer border-2 border-indigo-800/20 shadow-2xl
        hover:border-indigo-800/20 hover:shadow-indigo-800/20 transition-all duration-150
    "
      href="/timeline"
    >
      <h1
        className="text-xl md:text-3xl text-cyan-200/90 z-10
      text-shadow-[rgba(255, 255, 255, 0.5)]"
      >
        {t('title')}
      </h1>
      <p className="text-xs text-cyan-100 z-10 text-center">
        {t('description')}
      </p>
      <TimelineSvg className="absolute w-full h-128" />
    </Link>
  );
}


