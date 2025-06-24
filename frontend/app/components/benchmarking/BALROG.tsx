import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import BoxPlot from "./BoxPlot";

type Environments = "BabyAI" | "Crafter" | "TextWorld" | "BabalsAI" | "MiniHack" | "NetHack" | "Average";

export default function BALROG({ environment = "Average" }: { environment?: Environments }) {
    const { data } = useEpochAIExternalBenchmarks({
      filepath: "/data/external_benchmark_balrog.csv",
      scoreName: "Average progress",
      extraFields: [
        "Average progress",
        "Average Standard error",
        "BabyAI progress",
        "BabyAI Standard error",
        "Crafter progress",
        "Crafter Standard error",
        "TextWorld progress",
        "TextWorld Standard error",
        "BabalsAI progress",
        "BabalsAI Standard error",
        "MiniHack progress",
        "MiniHack Standard error",
        "NetHack progress",
        "NetHack Standard error",
        "Date added",
        "Trajectories",
      ],
    });

    return (
        <BoxPlot data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d[`${environment} progress`] as string) * 100,
            stderr: parseFloat(d[`${environment} Standard error`] as string) * 100,
            label: d.label,
            color: d.color,
            extra: {
                "모델 이름": d.label,
                "모델 식별자": d.modelVersion,
                "평균 진행도": `${d.score}%`,
                "평균 표준 오차": `${parseFloat(d["Average Standard error"] as string) * 100}%`,
            }
        }))} />
    )
}