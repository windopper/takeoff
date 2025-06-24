import { useModelVersions } from "@/app/hooks/useModelVersions";
import { useOrganizations } from "@/app/hooks/useOrganizations";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import ScatterPlot from "./ScatterPlot";
import { getOrganizationColors } from "./utils";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";

interface FictionLiveBenchData {
  id: string;
  modelVersion: string;
  "120kScore": string;
  "60kScore": string;
  "32kScore": string;
  "16kScore": string;
  "8kScore": string;
  "4kScore": string;
  "2kScore": string;
  "1kScore": string;
  "400Score": string;
  label: string;
  date: Date;
  color: string;
  source: string;
  sourceLink: string;
}

export default function FictionLiveBench() {
  const { data } = useEpochAIExternalBenchmarks({
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

  return (
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
          "120k Score": `${d.score}%`,
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
  );
}
