import BoxPlot from "./BoxPlot";
import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";
import { GraphSettingWrapper } from "./components/GraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { memo, useContext } from "react";
import { useTranslations, useLocale } from "next-intl";
import { BenchmarkContext } from "./BenchmarkSelector";

function GPQADiamond() {
    const t = useTranslations('benchmarking.tooltips');
    const locale = useLocale();
    const { color, groupBy, viewType } = useContext(BenchmarkContext);
    
    const { data, legends } = useEpochAIBoxplotBenchmarks("GPQA diamond", {
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
                        [t('averageAccuracy')]: parseFloat(run.bestScore),
                        organization: run.organization,
                        country: run.country,
                        date: run.date,
                    }))}
                    viewFields={[
                        "Model version",
                        t('averageAccuracy'),
                        "organization",
                        "country",
                    ]}
                    defaultSortBy={t('averageAccuracy')}
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
                        [t('averageAccuracy')]: `${run.bestScore}%`,
                        [t('standardError')]: `${run.standardError}%`,
                        [t('releaseDate')]: run.date.toLocaleDateString(locale === 'ko' ? "ko-KR" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
                    },
                }))} />
            )}
        </>
    )
}

export default memo(GPQADiamond);