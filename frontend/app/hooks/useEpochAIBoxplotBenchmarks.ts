import { useEffect, useState } from "react";
import useBenchmarkRuns, { Tasks } from "./useBenchmarkRuns";
import { useModelVersions } from "./useModelVersions";
import { useOrganizations } from "./useOrganizations";
import {
  DEFAULT_COLOR,
  getCountryColors,
  getOrganizationColors,
} from "../components/benchmarking/utils";
import useCountry from "./useCountry";

export interface EpochAIBoxPlotBenchmarks {
  id: string;
  date: Date;
  model: string;
  modelVersion: string;
  bestScore: string;
  standardError: string;
  color: string;
  organization: string;
  country: string;
}

export default function useEpochAIBoxplotBenchmarks(
  task: Tasks,
  config: {
    enableColor?: boolean;
    groupBy?: "organization" | "country" | "public";
  } = {
    enableColor: true,
    groupBy: "organization",
  }
) {
  const { enableColor, groupBy } = config;
  const [data, setData] = useState<EpochAIBoxPlotBenchmarks[]>([]);
  const [legends, setLegends] = useState<{ name: string; color: string }[]>([]);
  const { benchmarkRuns, findBenchmarkResultByTask } = useBenchmarkRuns();
  const { organizations, findOrganization } = useOrganizations();
  const { modelVersions, findModelVersion } = useModelVersions();
  const { data: countryData, findCountryFromAllMLSystems } = useCountry();

  useEffect(() => {
    if (benchmarkRuns.length === 0) return;
    if (modelVersions.length === 0) return;
    if (organizations.length === 0) return;
    if (countryData.length === 0) return;

    const benchmarkResults = findBenchmarkResultByTask(task);

    const filteredData = benchmarkResults.filter((run) => {
      const modelVersion = findModelVersion(run.model);
      return modelVersion?.versionReleaseDate;
    });

    const mapLegends = new Map<string, { name: string; color: string }>();

    const processedData = filteredData.map((run) => {
      const modelVersion = findModelVersion(run.model);
      const country = findCountryFromAllMLSystems(modelVersion?.model || "") || "Other";
      
      const organization =
        findOrganization(modelVersion?.model || run.model || "")?.organization || "Other";

      const color = enableColor
        ? groupBy === "organization"
          ? getOrganizationColors(organization)
          : groupBy === "country"
          ? getCountryColors(country || "")
          : DEFAULT_COLOR
        : DEFAULT_COLOR;

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
        id: run.id,
        model: modelVersion?.model || run.model,
        modelVersion: run.model,
        bestScore: (parseFloat(run.bestScore) * 100).toFixed(2),
        standardError: (parseFloat(run.standardError) * 100).toFixed(2),
        country: country || "",
        organization: organization,
        date: modelVersion?.versionReleaseDate
          ? new Date(modelVersion.versionReleaseDate)
          : new Date(),
        color: color,
      };
    });

    setData(processedData);
    setLegends(Array.from(mapLegends.values()));
  }, [benchmarkRuns, modelVersions, organizations, countryData, enableColor, groupBy, task]);

  return {
    data,
    legends,
  };
}
