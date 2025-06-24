import BoxPlot from "./BoxPlot";
import useEpochAIBoxplotBenchmarks from "@/app/hooks/useEpochAIBoxplotBenchmarks";

export default function GPQADiamond() {
    const { data } = useEpochAIBoxplotBenchmarks("GPQA diamond");

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
                "평균 정확도": `${run.bestScore}%`,
                "표준 편차": `${run.standardError}%`,
                "출시일": run.date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
            },
        }))} />
    )
}