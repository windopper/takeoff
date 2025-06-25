import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";
import { GraphSettingWrapper } from "./components/GraphSetting";
import { useState } from "react";
import useGraphSetting from "./hooks/useGraphSetting";
import BenchmarkTable from "./components/BenchmarkTable";

export default function AiderPolyGlot() {
  const { color, setColor, groupBy, setGroupBy, viewType, setViewType } = useGraphSetting();

  const { data, legends } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_aider_polyglot.csv",
    scoreName: "Percent correct",
    sourceName: "Source",
    sourceLinkName: "Source link",
    extraFields: ["Cost", "Edit format"],
    enableColor: color,
    groupBy: groupBy,
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
          data={data.map((d) => ({
            id: d.id,
            "Model version": d.modelVersion,
            "정확도": parseFloat(d.score) / 100,
            organization: d.organization,
            country: d.country,
            date: d.date,
          }))}
          viewFields={[
            "Model version",
            "정확도",
            "organization",
            "country",
          ]}
          defaultSortBy="정확도"
        />
      ) : (
        <ScatterPlot
          data={data.map((d) => ({
            id: d.id,
            x: d.date,
            y: parseFloat(d.score) / 100,
            label: d.label,
            color: d.color,
            extra: {
              "모델 이름": d.label,
              "모델 식별자": d.modelVersion,
              "정확도 (%)": `${parseFloat(d.score) / 100}%`,
              "에디트 포맷": d["Edit format"],
              비용: d["Cost"],
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
