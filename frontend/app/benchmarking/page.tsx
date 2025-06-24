"use client";

import { useState } from "react";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

// 벤치마크 컴포넌트 imports
import AiderPolyGlot from "@/app/components/benchmarking/AiderPolyGlot";
import FictionLiveBench from "@/app/components/benchmarking/FictionLiveBench";
import VPCT from "@/app/components/benchmarking/VPCT";
import GPQADiamond from "../components/benchmarking/GPQADiamond";
import FrontierMath from "../components/benchmarking/FrontierMath";
import MathLevel5 from "../components/benchmarking/MathLevel5";
import OTISMockAIME from "../components/benchmarking/OTISMockAIME";
import SWEBenchVerified from "../components/benchmarking/SWEBenchVerified";
import WeirdML from "../components/benchmarking/WeirdML";
import BALROG from "../components/benchmarking/BALROG";
import Factorio from "../components/benchmarking/Factorio";
import GeoBench from "../components/benchmarking/GeoBench";
import SimpleBench from "../components/benchmarking/SimpleBench";
import { Benchmark, benchmarkDisplayNames, descriptions } from "@/data/benchmarking/description";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Citation from "../components/benchmarking/Citation";
import Background from "../components/benchmarking/Background";
import BenchmarkHero from "../components/benchmarking/BenchmarkHero";

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

export default function Benchmarking() {
  const [selectedBenchmark, setSelectedBenchmark] =
    useState<Benchmark>("aider-polyglot");

  return (
    <div className="min-h-screen m-auto">
      {/* 배경 효과 */}
      <Background className="fixed top-0 left-0 w-full h-full -z-50" stroke="white" />
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm -z-40"></div>
      <Header />
      <div className="flex flex-col items-center justify-center relative mt-20 pb-16 px-4">
        <BenchmarkHero />
        {/* 벤치마크 배지 */}
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
      </div>
      <div className="relative max-w-6xl m-auto flex flex-col pt-24">
        <Citation />
      </div>
      <Footer />
    </div>
  );
}
