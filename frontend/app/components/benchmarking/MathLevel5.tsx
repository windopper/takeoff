import BoxPlot from "./BoxPlot";
import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";

export default function MathLevel5() {
    const { data } = useEpochAIBoxplotBenchmarks("MATH level 5");

    return (
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
    )
}