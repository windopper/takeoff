'use client';

import { Benchmark, benchmarkDisplayNames } from "@/data/benchmarking/description"; 
import { useState } from "react";
import BALROG from "./BALROG";
import AiderPolyGlot from "./AiderPolyGlot";
import FictionLiveBench from "./FictionLiveBench";
import VPCT from "./VPCT";
import GPQADiamond from "./GPQADiamond";
import FrontierMath from "./FrontierMath";
import MathLevel5 from "./MathLevel5";
import OTISMockAIME from "./OTISMockAIME";
import SWEBenchVerified from "./SWEBenchVerified";
import WeirdML from "./WeirdML";
import Factorio from "./Factorio";
import GeoBench from "./GeoBench";
import SimpleBench from "./SimpleBench";

const benchmarks: Benchmark[] = [
    "aider-polyglot",
    "fiction-live-bench",
    "vpct",
    "gpqa-diamond",
    "frontier-math",
    "math-level-5",
    "otis-mock-aime",
    "swe-bench-verified",
    "weird-ml",
    "balrog",
    "factorio",
    "geo-bench",
    "simple-bench",
  ];
export default function BenchmarkSelector() {
    const [selectedBenchmark, setSelectedBenchmark] =
    useState<Benchmark>("aider-polyglot");

    return (
      <>
        <div className="sticky top-20 py-3 mb-6 z-[100] w-screen flex justify-center backdrop-blur-lg">
          <div className="flex flex-row gap-2 max-w-6xl flex-wrap justify-center w-full m-auto">
            {benchmarks.map((benchmark) => (
              <div
                key={benchmark}
                className={`rounded-full px-3 flex-nowrap cursor-pointer transition-all duration-200 hover:bg-zinc-700 ${
                  selectedBenchmark === benchmark
                    ? "bg-zinc-300 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400"
                }`}
                onClick={() => setSelectedBenchmark(benchmark)}
              >
                <span className="text-xs whitespace-nowrap">
                  {benchmarkDisplayNames[benchmark]}
                </span>
              </div>
            ))}
          </div>
        </div>
        {selectedBenchmark === "balrog" && <BALROG />}
        {selectedBenchmark === "aider-polyglot" && <AiderPolyGlot />}
        {selectedBenchmark === "fiction-live-bench" && <FictionLiveBench />}
        {selectedBenchmark === "vpct" && <VPCT />}
        {selectedBenchmark === "gpqa-diamond" && <GPQADiamond />}
        {selectedBenchmark === "frontier-math" && <FrontierMath />}
        {selectedBenchmark === "math-level-5" && <MathLevel5 />}
        {selectedBenchmark === "otis-mock-aime" && <OTISMockAIME />}
        {selectedBenchmark === "swe-bench-verified" && <SWEBenchVerified />}
        {selectedBenchmark === "weird-ml" && <WeirdML />}
        {selectedBenchmark === "factorio" && <Factorio />}
        {selectedBenchmark === "geo-bench" && <GeoBench />}
        {selectedBenchmark === "simple-bench" && <SimpleBench />}
      </>
    );
}