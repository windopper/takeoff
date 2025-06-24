import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";

export default function AiderPolyGlot() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_aider_polyglot.csv",
    scoreName: "Percent correct",
    sourceName: "Source",
    sourceLinkName: "Source link",
    extraFields: ["Cost", "Edit format"],
  });

  return (
    <ScatterPlot
      data={data.map((d) => ({
        id: d.id,
        x: d.date,
        y: parseFloat(d.score) / 100,
        label: d.label,
        color: d.color,
        extra: {
          "모델 이름": d.label,
          "모델 식별자": d.modelVersion,
          "정확도 (%)": `${parseFloat(d.score) / 100}%`,
          "에디트 포맷": d["Edit format"],
          비용: d["Cost"],
          출처: (
            <Link
              href={d.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
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
