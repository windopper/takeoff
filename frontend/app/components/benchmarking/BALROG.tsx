import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import BoxPlot from "./BoxPlot";
import { useState } from "react";
import { GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";

type Environments =
  | "BabyAI"
  | "Crafter"
  | "TextWorld"
  | "BabalsAI"
  | "MiniHack"
  | "NetHack"
  | "Average";
const environments: Environments[] = [
  "BabyAI",
  "Crafter",
  "TextWorld",
  "BabalsAI",
  "MiniHack",
  "NetHack",
  "Average",
];

export default function BALROG() {
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<Environments>("Average");
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    enableColor: color,
    groupBy: groupBy,
    filepath: "/data/external_benchmark_balrog.csv",
    scoreName: "Average progress",
    extraFields: [
      "Average progress",
      "Average Standard error",
      "BabyAI progress",
      "BabyAI Standard error",
      "Crafter progress",
      "Crafter Standard error",
      "TextWorld progress",
      "TextWorld Standard error",
      "BabalsAI progress",
      "BabalsAI Standard error",
      "MiniHack progress",
      "MiniHack Standard error",
      "NetHack progress",
      "NetHack Standard error",
      "Date added",
      "Trajectories",
    ],
  });

  const getProgressValue = (environment: Environments) => {
    return environment === "Average" ? "Average progress" : `${environment} progress`;
  };

  return (
    <>
      <GraphSettingWrapper<Environments>
        filters={[
          {
            name: "환경",
            contents: environments,
            selected: selectedEnvironment,
            setSelected: setSelectedEnvironment,
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
            [`${selectedEnvironment} progress`]: parseFloat(d[getProgressValue(selectedEnvironment)] as string) * 100,
            organization: d.organization,
            country: d.country,
            date: d.date,
          }))}
          viewFields={[
            "Model version",
            `${selectedEnvironment} progress`,
            "organization",
            "country",
          ]}
          defaultSortBy={`${selectedEnvironment} progress`}
        />
      ) : (
        <BoxPlot
          data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d[getProgressValue(selectedEnvironment)] as string) * 100,
            stderr:
              parseFloat(d[`${selectedEnvironment} Standard error`] as string) *
              100,
            label: d.label,
            color: d.color,
            extra: {
              "모델 이름": d.label,
              "모델 식별자": d.modelVersion,
              "평균 진행도": `${d.score}%`,
              "평균 표준 오차": `${
                parseFloat(d["Average Standard error"] as string) * 100
              }%`,
            },
          }))}
        />
      )}
    </>
  );
}
