import * as d3 from 'd3';

import { useEffect, useState } from "react";

interface ModelVersion {
    id: string;
    displayName: string;
    huggingFaceDeveloperId: string;
    link: string;
    model: string;
    notes: string;
    versionReleaseDate: string;
    benchmarksRuns: string;
}

export function useModelVersions() {
    const [modelVersions, setModelVersions] = useState<ModelVersion[]>([]);

    useEffect(() => {
        const fetchModelVersions = async () => {
            const data = await d3.csv('/data/model_versions.csv');
            setModelVersions((prevModelVersions) => {
                return data.map((d) => ({
                    id: d['id'] as string,
                    displayName: d['Display name'] as string,
                    huggingFaceDeveloperId: d['Hugging Face developer id'] as string,
                    link: d['Link'] as string,
                    model: d['Model'] as string,
                    notes: d['Notes'] as string,
                    versionReleaseDate: d['Version release date'] as string,
                    benchmarksRuns: d['benchmarks/runs'] as string,
                }))
            })
        }
        fetchModelVersions();
    }, [])

    const findModelVersion = (id: string) => {
        return modelVersions.find((mv) => mv.id === id);
    }

    return { modelVersions, findModelVersion };
}