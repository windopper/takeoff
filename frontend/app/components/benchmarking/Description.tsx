"use client";

import { Benchmark, benchmarkDisplayNames, descriptions } from "../../../data/benchmarking/description";
import Markdown from "react-markdown";
import { useLocale } from "next-intl";

export default function Description({ benchmark }: { benchmark: Benchmark }) {
    const locale = useLocale();
    const isKorean = locale === 'ko';
    
    return (
        <div className="flex flex-col gap-2 mt-16 max-w-6xl border-t pt-16 border-zinc-800">
            <h1 className="text-2xl font-bold">{benchmarkDisplayNames[benchmark]}</h1>
            <div className="text-lg text-zinc-400 prose-lg prose-a:underline">
                <Markdown>{isKorean ? descriptions[benchmark].md : descriptions[benchmark].mdEn}</Markdown>
            </div>
        </div>
    )
}