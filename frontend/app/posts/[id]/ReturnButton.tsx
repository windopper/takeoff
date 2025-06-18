'use client';

import { MaterialSymbolsChevronLeft } from "@/app/icons/MaterialSymbolsChevronLeft";
import { usePathname, useRouter } from "next/navigation";

export default function ReturnButton() {
    const router = useRouter();

    return (
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-8">
            <MaterialSymbolsChevronLeft className="w-4 h-4" />
            목록으로 돌아가기
        </button>
    )
}