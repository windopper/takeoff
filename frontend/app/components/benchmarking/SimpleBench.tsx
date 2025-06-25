import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";

// id,Model version,Score (AVG@5),Source,Source link (site from table),Notes
export default function SimpleBench() {
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

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
              "모델 이름": d.label,
              "모델 식별자": d.modelVersion,
              "정확도 (avg@5)": `${d.score}%`,
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
      )}
    </>
  );
}
