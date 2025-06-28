import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";

// id,Model version,Tools,ACW Country %,ACW Avg Score,ACW Median Score,ACW Median Distance (km),ACW Refusal,AVW Country %,AVW Avg Score,AVW Median Score,AVW Median Distance (km),AVW Refusal,Rural Country %,Rural Avg Score,Rural Median Score,Rural Median Distance,Rural Refusal,Urban Country %,Urban Avg Score,Urban Median Score,Urban Median Distance (km),Urban Refusal,Photos Country %,Photos Avg Score,Photos Median Score,Photos Median Distance (km),Photos Refusal,Notes,Source,Source link

type Tasks = "ACW Avg Score" | "AVW Avg Score" | "Rural Avg Score" | "Urban Avg Score" | "Photos Avg Score";

const tasks: Tasks[] = ["ACW Avg Score", "AVW Avg Score", "Rural Avg Score", "Urban Avg Score", "Photos Avg Score"];

export default function GeoBench() {
  const t = useTranslations('benchmarking.tooltips');
  const [selectedTask, setSelectedTask] = useState<Tasks>("Photos Avg Score");
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
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

  const filteredData = data.filter((d) => d[selectedTask] !== "");

  return (
    <>
      <GraphSettingWrapper
        filters={[
          {
            name: t('metric'),
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
            [selectedTask]: parseFloat(d[selectedTask] as string),
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
            y: parseFloat(d[selectedTask] as string),
            label: d.label,
            color: d.color,
            extra: {
              [t('modelName')]: d.label,
              [t('modelVersion')]: d.modelVersion,
              [selectedTask]: `${parseFloat(d[selectedTask] as string)}`,
              "Tools": d.tools,
              [t('source')]: (
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
      )}
    </>
  );
}
