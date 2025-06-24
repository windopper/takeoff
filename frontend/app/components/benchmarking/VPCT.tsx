import { useEffect, useState } from "react";
import * as d3 from "d3";
import { useOrganizations } from "@/app/hooks/useOrganizations";
import { useModelVersions } from "@/app/hooks/useModelVersions";
import { getOrganizationColors } from "./utils";
import ScatterPlot from "./ScatterPlot";
import Link from "next/link";
import useEpochAIExternalBenchmarks from "@/app/hooks/useEpochAIExternalBenchmarks";

interface VPCTData {
  id: string;
  modelVersion: string;
  correct: string;
  date: Date;
  organization: string;
  color: string;
  source: string;
  sourceLink: string;
  label: string;
}

export default function VPCT() {
  const { data } = useEpochAIExternalBenchmarks({
    filepath: "/data/external_benchmark_vpct.csv",
    scoreName: "Correct",
    sourceName: "Source",
    sourceLinkName: "Source link",
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
          "정확도": `${d.score}%`,
          "출처": (
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
