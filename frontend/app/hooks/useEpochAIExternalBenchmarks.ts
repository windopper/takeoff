'use client';

import { useModelVersions } from "./useModelVersions";
import { useOrganizations } from "./useOrganizations";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { getOrganizationColors } from "../components/benchmarking/utils";

interface EpochAIScatterplotData {
  modelVersion: string;
  label: string;
  color: string;
  notes: string;
  score: string;
  source: string;
  sourceLink: string;
  id: string;
  date: Date;
  organization: string;
  [key: string]: string | number | Date;
}

export default function useEpochAIExternalBenchmarks({
    filepath,
    scoreName,
    sourceName = "Source",
    sourceLinkName = "Source link",
    modelVersionName = "Model version",
    notesName = "Notes",
    extraFields = [],
}: {
    filepath: string;
    scoreName: string;
    sourceName?: string;
    sourceLinkName?: string;
    modelVersionName?: string;
    notesName?: string;
    extraFields?: string[];
}) {
  const [data, setData] = useState<EpochAIScatterplotData[]>([]);
  const { modelVersions, findModelVersion } = useModelVersions();
  const { organizations, findOrganization } = useOrganizations();

  useEffect(() => {
    if (modelVersions.length === 0) return;
    if (organizations.length === 0) return;

    const fetchData = async () => {
        const csvData = await d3.csv(filepath);
        const filteredCsvData = csvData.filter((d) => {
            const modelVersion = findModelVersion(d[modelVersionName] as string);
            if (!modelVersion?.versionReleaseDate) return false;
            if (d[scoreName] === "") return false;
            return true;
        });

        const processedData = filteredCsvData.map((d) => {
            const modelVersion = findModelVersion(d[modelVersionName] as string);
            return {
                id: d["id"] as string,
                modelVersion: d[modelVersionName] as string,
                label: modelVersion?.displayName || modelVersion?.model || d[modelVersionName] || "",
                color: getOrganizationColors[findOrganization(modelVersion?.model || "")?.organization as keyof typeof getOrganizationColors] || "#3b82f6",
                notes: d[notesName] as string,
                score: (parseFloat(d[scoreName] as string) * 100).toFixed(4).slice(0, 4),
                source: d[sourceName] as string,
                sourceLink: d[sourceLinkName] as string,
                date: modelVersion ? new Date(modelVersion.versionReleaseDate) : new Date(),
                organization: findOrganization(modelVersion?.model || "")?.organization || "",
                ...extraFields.reduce((acc, field) => {
                    acc[field] = d[field] as string;
                    return acc;
                }, {} as Record<string, string>),
            };
        });

        setData(processedData);
    }

    fetchData();
  }, [modelVersions, organizations]);

  return { data };
}
