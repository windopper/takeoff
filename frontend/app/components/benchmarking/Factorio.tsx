import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
// id,Model version,Tools,Production score,Lab Success %,Milestones,Automation,Most complex item,Date added,Cost,Source,Source link (site from table),Notes

type Tasks = "Production score" | "Lab Success %"

const tasks: Tasks[] = ["Production score", "Lab Success %"]

export default function Factorio() {
  const [selectedTask, setSelectedTask] = useState<Tasks>("Lab Success %");
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();
  
  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
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

  const filteredData = data.filter((d) => selectedTask === "Production score" ? d["Production score"] !== "" : d["Lab Success %"] !== "");

  return (
    <>
    <GraphSettingWrapper<Tasks>
        filters={[
            {
                name: "지표",
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
        data={filteredData.map((d) => ({
          id: d.id,
          "Model version": d.modelVersion,
          [selectedTask]: selectedTask === "Production score" 
            ? parseInt(d["Production score"] as string) 
            : parseFloat(d["Lab Success %"] as string) * 100,
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
        data={filteredData.map((d) => ({
          id: d.id,
          x: d.date,
          y: selectedTask === "Production score" ? parseInt(d["Production score"] as string) : parseFloat(d["Lab Success %"] as string) * 100,
          label: d.label,
          color: d.color,
          extra: {
            "모델 이름": d.label,
            "모델 식별자": d.modelVersion,
            "생산 점수": `${d["Production score"]}`,
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
        yAxisPostfix={selectedTask === "Production score" ? "" : "%"}
      />
    )}
    </>
  );
}
