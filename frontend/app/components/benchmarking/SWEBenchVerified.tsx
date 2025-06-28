import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";
import BoxPlot from "./BoxPlot";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations, useLocale } from "next-intl";

export default function SWEBenchVerified() {
    const t = useTranslations('benchmarking.tooltips');
    const locale = useLocale();
    const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();
    
    const { data, legends } = useEpochAIBoxplotBenchmarks("SWE-Bench verified", {
        enableColor: color,
        groupBy: groupBy,
    });

    return (
        <>
            <GraphSettingWrapper
                filters={[]}
                isGroupColorSetting={color}
                setIsGroupColorSetting={setColor}
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                legends={legends}
                viewType={viewType}
                setViewType={setViewType}
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