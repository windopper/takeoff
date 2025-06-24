import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
// id,Model version,Tools,Production score,Lab Success %,Milestones,Automation,Most complex item,Date added,Cost,Source,Source link (site from table),Notes
export default function Factorio() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_factorio_learning_environment.csv",
    scoreName: "Lab Success %",
    extraFields: [
      "Production score",
      "Lab Success %",
      "Milestones",
      "Automation",
      "Most complex item",
      "Date added",
      "Cost",
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
          "생산 점수": `${d.score}%`,
          "실험 성공률": `${parseFloat(d["Lab Success %"] as string) * 100}%`,
          마일스톤: d["Milestones"],
          자동화: d["Automation"],
          "가장 복잡한 아이템": d["Most complex item"],
          출처: (
            <Link
              href={d["Source link (site from table)"] as string}
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
