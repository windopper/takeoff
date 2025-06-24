import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";

export default function WeirdML() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_weirdml.csv",
    scoreName: "Average",
    sourceLinkName: "Source link (site from table)",
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
          "평균 점수": `${d.score}%`,
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
