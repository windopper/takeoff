import { useEffect, useState } from "react";
import useBenchmarkRuns, { Tasks } from "./useBenchmarkRuns";
import { useModelVersions } from "./useModelVersions";
import { useOrganizations } from "./useOrganizations";
import { getOrganizationColors } from "../components/benchmarking/utils";

interface EpochAIBoxPlotBenchmarks {
    id: string;
    date: Date;
    model: string;
    modelVersion: string;
    bestScore: string;
    standardError: string;
    color: string;
}  

export default function useEpochAIBoxplotBenchmarks(task: Tasks) {
    const [data, setData] = useState<EpochAIBoxPlotBenchmarks[]>([]);
    const { benchmarkRuns, findBenchmarkResultByTask } = useBenchmarkRuns();
    const { organizations, findOrganization } = useOrganizations();
    const { modelVersions, findModelVersion } = useModelVersions();
    const benchmarkResults = findBenchmarkResultByTask(task);

    useEffect(() => {
        if (benchmarkResults.length === 0) return;
        if (modelVersions.length === 0) return;
        if (organizations.length === 0) return;
        if (data.length > 0) return;

        const filteredData = benchmarkResults.filter(run => {
            const modelVersion = findModelVersion(run.model);
            return modelVersion?.versionReleaseDate;
        })

        const processedData = filteredData.map(run => {
            const modelVersion = findModelVersion(run.model);
            return {
              id: run.id,
              model: modelVersion?.model || run.model,
              modelVersion: run.model,
              bestScore: (parseFloat(run.bestScore) * 100).toFixed(2),
              standardError: (parseFloat(run.standardError) * 100).toFixed(2),
              date: modelVersion?.versionReleaseDate
                ? new Date(modelVersion.versionReleaseDate)
                : new Date(),
              color:
                getOrganizationColors[
                    findOrganization(modelVersion?.model || "")
                        ?.organization as keyof typeof getOrganizationColors
                ] || "#3b82f6",
            };
        })

        setData(processedData);
    }, [benchmarkResults, modelVersions, organizations])

    return {
        data,
    }
}