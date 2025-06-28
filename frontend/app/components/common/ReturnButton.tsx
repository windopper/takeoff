'use client';

import { MaterialSymbolsChevronLeft } from "@/app/icons/MaterialSymbolsChevronLeft";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ReturnButton({ text }: { text?: string }) {
    const router = useRouter();
    const t = useTranslations('common');
    
    const handleClick = () => {
        if (window.history.length > 1) {
            const previousPath = document.referrer;
            const currentSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
            if (previousPath && previousPath.includes(currentSiteUrl)) {
                router.back();
            } else {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }

    return (
        <button onClick={handleClick} className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-8">
            <MaterialSymbolsChevronLeft className="w-4 h-4" />
            {text || t('returnToList')}
        </button>
    )
}