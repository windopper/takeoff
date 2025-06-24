import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
// id,Model version,Score (AVG@5),Source,Source link (site from table),Notes
export default function SimpleBench() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_simplebench.csv",
    scoreName: "Score (AVG@5)",
    sourceLinkName: "Source link (site from table)",
    extraFields: [
      "Model version",
      "Score (AVG@5)",
      "Source",
      "Source link (site from table)",
      "Notes",
    ],
  });

  return (
    <ScatterPlot
      data={data.map((d) => ({
        id: d.id,
        x: d.date,
        y: parseFloat(d.score),
        label: d.label,
        color: d.color,
        extra: {
          "모델 이름": d.label,
          "모델 식별자": d.modelVersion,
          "정확도 (avg@5)": d.score,
          출처: (
            <Link
              href={d.sourceLink as string}
              target="_blank"
              className="underline"
            >
              {d.source}
            </Link>
          ),
        },
      }))}
    />
  );
}
