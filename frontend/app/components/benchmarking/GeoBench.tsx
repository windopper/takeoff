import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";

// id,Model version,Tools,ACW Country %,ACW Avg Score,ACW Median Score,ACW Median Distance (km),ACW Refusal,AVW Country %,AVW Avg Score,AVW Median Score,AVW Median Distance (km),AVW Refusal,Rural Country %,Rural Avg Score,Rural Median Score,Rural Median Distance,Rural Refusal,Urban Country %,Urban Avg Score,Urban Median Score,Urban Median Distance (km),Urban Refusal,Photos Country %,Photos Avg Score,Photos Median Score,Photos Median Distance (km),Photos Refusal,Notes,Source,Source link
export default function GeoBench() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_geobench.csv",
    scoreName: "Photos Avg Score",
    extraFields: [
      "ACW Country %",
      "ACW Avg Score",
      "ACW Median Score",
      "ACW Median Distance (km)",
      "ACW Refusal",
      "AVW Country %",
      "AVW Avg Score",
      "AVW Median Score",
      "AVW Median Distance (km)",
      "AVW Refusal",
      "Rural Country %",
      "Rural Avg Score",
      "Rural Median Score",
      "Rural Median Distance",
      "Rural Refusal",
      "Urban Country %",
      "Urban Avg Score",
      "Urban Median Score",
      "Urban Median Distance (km)",
      "Urban Refusal",
      "Photos Country %",
      "Photos Avg Score",
      "Photos Median Score",
      "Photos Median Distance (km)",
      "Photos Refusal",
      "Notes",
      "Source",
      "Source link",
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
          "Photos Avg Score": `${d["Photos Avg Score"]}`,
          Tools: d.tools,
          출처: (
            <Link
              href={d["Source link"] as string}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {d.source}
            </Link>
          ),
        },
      }))}
      yAxisPostfix=""
    />
  );
}
