import BoxPlot from "./BoxPlot";
import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";

export default function MathLevel5() {
    const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();
    
    const { data, legends } = useEpochAIBoxplotBenchmarks("MATH level 5", {
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
                        "pass@1 정확도": parseFloat(run.bestScore),
                        organization: run.organization,
                        country: run.country,
                        date: run.date,
                    }))}
                    viewFields={[
                        "Model version",
                        "pass@1 정확도",
                        "organization",
                        "country",
                    ]}
                    defaultSortBy="pass@1 정확도"
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
                        "모델 이름": run.model,
                        "모델 식별자": run.modelVersion,
                        "pass@1 정확도": `${run.bestScore}%`,
                        "pass@1 표준 편차": `${run.standardError}%`,
                        "출시일": run.date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
                    },
                }))} />
            )}
        </>
    )
}