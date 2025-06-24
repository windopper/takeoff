// id,task,model,Best score (across scorers),Scores,log viewer,logs,started_at,Status
import { useEffect, useState } from "react";
import * as d3 from "d3";

interface BenchmarkRun {
    id: string;
    task: string;
    model: string;
    bestScore: string;
    scores: string;
    logViewer: string;
    logs: string;
    startedAt: string;
    status: string;
    standardError: string;
}

// Name,scorer,mean,stderr,BenchmarkRuns
interface BenchmarkScore {
    name: string;
    scorer: string;
    mean: number;
    stderr: number;
    benchmarkRuns: string;
}

export type Tasks =
  | "SWE-Bench verified"
  | "OTIS Mock AIME 2024-2025"
  | "MATH level 5"
  | "GPQA diamond"
  | "FrontierMath-2025-02-28-Private";

export default function useBenchmarkRuns() {
    const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>([]);
    const [scores, setScores] = useState<BenchmarkScore[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await d3.csv("/data/benchmarks_scores.csv");

            setScores(response.map((row) => ({
                name: row["Name"],
                scorer: row["scorer"],
                mean: parseFloat(row["mean"]),
                stderr: parseFloat(row["stderr"]),
                benchmarkRuns: row["BenchmarkRuns"],
            })));
        }
        fetchTasks();
    }, [])

    useEffect(() => {
        if (scores.length === 0) return;
        const fetchBenchmarkRuns = async () => {
            const response = await d3.csv("/data/benchmarks_runs.csv");

            const processedData = response.map((row) => {
                const score = scores.findLast(score => score.benchmarkRuns === row['id']);

                return {
                  id: row["id"],
                  task: row["task"],
                  model: row["model"],
                  bestScore: row["Best score (across scorers)"],
                  scores: row["Scores"],
                  logViewer: row["log viewer"],
                  logs: row["logs"],
                  startedAt: row["started_at"],
                  status: row["Status"],
                  standardError: score?.stderr ? score.stderr.toString() : "0",
                };
            })
            setBenchmarkRuns(processedData);
        }
        fetchBenchmarkRuns();
    }, [scores])

    const findBenchmarkResultByTask = (task: Tasks) => {
        return benchmarkRuns.filter((run) => run.task === task);
    }

    return { benchmarkRuns, findBenchmarkResultByTask };
}