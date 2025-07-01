import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { useContext, useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";
import { BenchmarkContext } from "./BenchmarkSelector";
// id,Model version,Tools,Production score,Lab Success %,Milestones,Automation,Most complex item,Date added,Cost,Source,Source link (site from table),Notes

type Tasks = "Production score" | "Lab Success %"

const tasks: Tasks[] = ["Production score", "Lab Success %"]

export default function Factorio() {
  const t = useTranslations('benchmarking.tooltips');
  const [selectedTask, setSelectedTask] = useState<Tasks>("Lab Success %");
  const { color, groupBy, viewType, setColor, setGroupBy, setViewType } = useContext(BenchmarkContext);

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
                name: t('metric'),
                contents: tasks,
                selected: selectedTask,
                setSelected: setSelectedTask,
            },
        ]}
        legends={legends}
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
            [t('modelName')]: d.label,
            [t('modelVersion')]: d.modelVersion,
            [t('productionScore')]: `${d["Production score"]}`,
            [t('labSuccessRate')]: `${parseFloat(d["Lab Success %"] as string) * 100}%`,
            [t('milestones')]: d["Milestones"],
            [t('automation')]: d["Automation"],
            [t('mostComplexItem')]: d["Most complex item"],
            [t('source')]: (
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
