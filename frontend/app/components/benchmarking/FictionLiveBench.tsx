import React, { useState } from "react";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";

type Tasks = "120k token score" | "60k token score" | "32k token score" | "16k token score" | "8k token score" | "4k token score" | "2k token score" | "1k token score" | "400 token score";

const tasks: Tasks[] = ["120k token score", "60k token score", "32k token score", "16k token score", "8k token score", "4k token score", "2k token score", "1k token score", "400 token score"];

// react memo
function FictionLiveBench() {
  const t = useTranslations('benchmarking.tooltips');
  const [selectedTask, setSelectedTask] = useState<Tasks>("120k token score");
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
    filepath: "/data/external_benchmark_fictionlivebench.csv",
    scoreName: "120k token score",
    sourceName: "Source",
    sourceLinkName: "Source link",
    extraFields: [
      "120k token score",
      "60k token score",
      "32k token score",
      "16k token score",
      "8k token score",
      "4k token score",
      "2k token score",
      "1k token score",
      "400 token score",
    ],
  });

  const filteredData = data.filter((d) => d[selectedTask] !== "");

  return (
    <>
      <GraphSettingWrapper<Tasks>
        filters={[
          {
            name: t('contextLength'),
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
          data={filteredData.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d[selectedTask] as string) * 100,
            label: d.label,
            color: d.color,
            extra: {
              [t('modelName')]: d.label,
              [t('modelVersion')]: d.modelVersion,
              [selectedTask]: `${parseFloat(d[selectedTask] as string) * 100}%`,
              [t('source')]: (
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

export default React.memo(FictionLiveBench);