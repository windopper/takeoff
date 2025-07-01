import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { GraphSettingWrapper } from "./components/GraphSetting";
import { useContext } from "react";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";
import { BenchmarkContext } from "./BenchmarkSelector";

// id,Model version,Score (AVG@5),Source,Source link (site from table),Notes
export default function SimpleBench() {
  const t = useTranslations('benchmarking.tooltips');
  const { color, groupBy, viewType } = useContext(BenchmarkContext);

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
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
    <>
      <GraphSettingWrapper
        filters={[]}
        legends={legends}
      />
      {viewType === "table" ? (
        <BenchmarkTable
          data={data}
          viewFields={[
            "Model version",
            "Score (AVG@5)",
            "organization",
            "country",
          ]}
          defaultSortBy="Score (AVG@5)"
        />
      ) : (
        <ScatterPlot
          data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d.score),
            label: d.label,
            color: d.color,
            extra: {
              [t('modelName')]: d.label,
              [t('modelVersion')]: d.modelVersion,
              [t('accuracy')]: `${d.score}%`,
              [t('source')]: (
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
      )}
    </>
  );
}
