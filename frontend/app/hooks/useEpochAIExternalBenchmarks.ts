'use client';

import { useModelVersions } from "./useModelVersions";
import { useOrganizations } from "./useOrganizations";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { DEFAULT_COLOR, getCountryColors, getOrganizationColors } from "../components/benchmarking/utils";
import useCountry from "./useCountry";

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
  country: string;
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
    enableColor = true,
    groupBy = "organization",
}: {
    filepath: string;
    scoreName: string;
    sourceName?: string;
    sourceLinkName?: string;
    modelVersionName?: string;
    notesName?: string;
    extraFields?: string[];
    enableColor?: boolean;
    groupBy?: "organization" | "country" | "public";
}) {
  const [legends, setLegends] = useState<{ name: string; color: string }[]>([]);
  const [data, setData] = useState<EpochAIScatterplotData[]>([]);
  const { modelVersions, findModelVersion } = useModelVersions();
  const { organizations, findOrganization } = useOrganizations();
  const { data: countryData, findCountryFromAllMLSystems } = useCountry();

  useEffect(() => {
    if (modelVersions.length === 0) return;
    if (organizations.length === 0) return;
    if (countryData.length === 0) return;

    const fetchData = async () => {
        const csvData = await d3.csv(filepath, {
            cache: 'force-cache'
        });
        const filteredCsvData = csvData.filter((d) => {
            const modelVersion = findModelVersion(d[modelVersionName] as string);
            if (!modelVersion?.versionReleaseDate) return false;
            if (d[scoreName] === "") return false;
            return true;
        });

        const mapLegends = new Map<string, { name: string; color: string }>();

        const processedData = filteredCsvData.map((d) => {
            const modelVersion = findModelVersion(d[modelVersionName] as string);
            const country = findCountryFromAllMLSystems(modelVersion?.model || "") || "Other";
            const organization = findOrganization(modelVersion?.model || "")?.organization || "Other";

            const color = enableColor ?
              groupBy === "organization"
                ? getOrganizationColors(organization)
                : groupBy === "country"
                ? getCountryColors(country || "")
                : DEFAULT_COLOR : DEFAULT_COLOR;

            if (enableColor && !mapLegends.has(color)) {
                if (groupBy === "organization") {
                    mapLegends.set(color, { name: organization, color: color });
                } else if (groupBy === "country") {
                    mapLegends.set(color, { name: country || "", color: color });
                } else {
                    mapLegends.set(color, { name: "Public", color: color });
                }
            }

            return {
                id: d["id"] as string,
                modelVersion: d[modelVersionName] as string,
                label: modelVersion?.displayName || modelVersion?.model || d[modelVersionName] || "",
                color: color,
                notes: d[notesName] as string,
                score: (parseFloat(d[scoreName] as string) * 100).toFixed(4).slice(0, 4),
                source: d[sourceName] as string,
                sourceLink: d[sourceLinkName] as string,
                date: modelVersion ? new Date(modelVersion.versionReleaseDate) : new Date(),
                organization: organization,
                country: country || "",
                ...extraFields.reduce((acc, field) => {
                    acc[field] = d[field] as string;
                    return acc;
                }, {} as Record<string, string>),
            };
        });

        setData(processedData);
        setLegends(Array.from(mapLegends.values()));
    }

    fetchData();
  }, [modelVersions, organizations, countryData, enableColor, groupBy]);

  return { data, legends };
}
