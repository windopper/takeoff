import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";
import BoxPlot from "./BoxPlot";
import { GraphSettingWrapper } from "./components/GraphSetting";
import { useContext } from "react";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations, useLocale } from "next-intl";
import { BenchmarkContext } from "./BenchmarkSelector";

export default function OTISMockAIME() {
    const t = useTranslations('benchmarking.tooltips');
    const locale = useLocale();
    const { color, groupBy, viewType } = useContext(BenchmarkContext);
    
    const { data, legends } = useEpochAIBoxplotBenchmarks("OTIS Mock AIME 2024-2025", {
        enableColor: color,
        groupBy: groupBy,
    });

    return (
        <>
            <GraphSettingWrapper
                filters={[]}
                legends={legends}
            />
            {viewType === "table" ? (
                <BenchmarkTable
                    data={data.map(run => ({
                        id: run.id,
                        "Model version": run.modelVersion,
                        [t('pass1Accuracy')]: parseFloat(run.bestScore),
                        organization: run.organization,
                        country: run.country,
                        date: run.date,
                    }))}
                    viewFields={[
                        "Model version",
                        t('pass1Accuracy'),
                        "organization",
                        "country",
                    ]}
                    defaultSortBy={t('pass1Accuracy')}
                />
            ) : (
                <BoxPlot data={data.map(run => ({
                    id: run.id,
                    x: run.date,
                    y: parseFloat(run.bestScore),
                    stderr: parseFloat(run.standardError),
                    label: run.model,
                    color: run.color,
                    extra: {
                        [t('modelName')]: run.model,
                        [t('modelVersion')]: run.modelVersion,
                        [t('pass1Accuracy')]: `${run.bestScore}%`,
                        [t('pass1StandardError')]: `${run.standardError}%`,
                        [t('releaseDate')]: run.date.toLocaleDateString(locale === 'ko' ? "ko-KR" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
                    },
                }))} />
            )}
        </>
    )
}