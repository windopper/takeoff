import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
// id,Model version,Shapes easy,Shapes hard,Shuffle easy,Shuffle hard,Digits unsup,Chess winners,Average,Source,Source link (site from table),Notes


type Tasks =
| "Average"
| "Shapes easy"
| "Shapes hard"
| "Shuffle easy"
| "Shuffle hard"
| "Digits unsup"
| "Chess winners";

const tasks: Tasks[] = ["Average", "Shapes easy", "Shapes hard", "Shuffle easy", "Shuffle hard", "Digits unsup", "Chess winners"];

export default function WeirdML() {
  const [selectedTask, setSelectedTask] = useState<Tasks>("Average");
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
    filepath: "/data/external_benchmark_weirdml.csv",
    scoreName: "Average",
    sourceLinkName: "Source link (site from table)",
    extraFields: tasks,
  });

  return (
    <>
      <GraphSettingWrapper<Tasks>
        filters={[
          {
            name: "Task",
            contents: tasks,
            selected: selectedTask,
            setSelected: setSelectedTask,
          },
        ]}
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
          data={data.map((d) => ({
            id: d.id,
            "Model version": d.modelVersion,
            [selectedTask]: parseFloat(d[selectedTask] as string) * 100,
            organization: d.organization,
            country: d.country,
            date: d.date,
          }))}
          viewFields={[
            "Model version",
            selectedTask,
            "organization",
            "country",
          ]}
          defaultSortBy={selectedTask}
        />
      ) : (
        <ScatterPlot
          data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d[selectedTask] as string) * 100,
            label: d.label,
            color: d.color,
            extra: {
              "모델 이름": d.label,
              "모델 식별자": d.modelVersion,
              [selectedTask]: `${(
                parseFloat(d[selectedTask] as string) * 100
              ).toFixed(2)}%`,
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
      )}
    </>
  );
}
