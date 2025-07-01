import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import { useContext, useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";
import { useTranslations } from "next-intl";
import { BenchmarkContext } from "./BenchmarkSelector";
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
  const t = useTranslations('benchmarking.tooltips');
  const [selectedTask, setSelectedTask] = useState<Tasks>("Average");
  const { color, groupBy, viewType } = useContext(BenchmarkContext);

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
        legends={legends}
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
              [t('modelName')]: d.label,
              [t('modelVersion')]: d.modelVersion,
              [selectedTask]: `${(
                parseFloat(d[selectedTask] as string) * 100
              ).toFixed(2)}%`,
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
