"use client";

import {
  Benchmark,
  benchmarkDisplayNames,
} from "@/data/benchmarking/description";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
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
import Description from "./Description";
import { GraphFilter, GraphSettingWrapper } from "./components/GraphSetting";
import useGraphSetting from "./hooks/useGraphSetting";

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

export const BenchmarkContext = createContext<{
  viewType: "table" | "graph";
  color: boolean;
  groupBy: "organization" | "country" | "public";
  tableSlice: number;
  setTableSlice: Dispatch<SetStateAction<number>>;
  setColor: Dispatch<SetStateAction<boolean>>;
  setGroupBy: Dispatch<SetStateAction<"organization" | "country" | "public">>;
  setViewType: Dispatch<SetStateAction<"table" | "graph">>;
  isMobile: boolean;
  setIsMobile: Dispatch<SetStateAction<boolean>>;
}>({
  viewType: "graph",
  color: false,
  groupBy: "organization",
  setColor: () => {},
  setGroupBy: () => {},
  setViewType: () => {},
  tableSlice: 15,
  setTableSlice: () => {},
  isMobile: false,
  setIsMobile: () => {},
});

export default function BenchmarkSelector() {
  const {
    viewType,
    color,
    groupBy,
    setColor,
    setGroupBy,
    setViewType,
    isMobile,
    setIsMobile,
  } = useGraphSetting();
  const [tableSlice, setTableSlice] = useState<number>(15);
  const [selectedBenchmark, setSelectedBenchmark] =
    useState<Benchmark>("aider-polyglot");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTableSlice(2);
      } else if (window.innerWidth < 1024) {
        setTableSlice(3);
      } else if (window.innerWidth < 1280) {
        setTableSlice(4);
      } else {
        setTableSlice(15);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BenchmarkContext.Provider
      value={{
        viewType,
        color,
        groupBy,
        setColor,
        setGroupBy,
        setViewType,
        tableSlice,
        setTableSlice,
        isMobile,
        setIsMobile,
      }}
    >
      <div className="sticky top-20 py-3 mb-6 z-[100] w-screen flex justify-center backdrop-blur-lg">
        <div className="flex flex-row gap-2 max-w-6xl flex-wrap justify-center w-full m-auto px-2">
          {benchmarks.map((benchmark) => (
            <motion.div
              key={benchmark}
              className={`rounded-full px-3 flex-nowrap cursor-pointer transition-all duration-200 hover:bg-zinc-700 ${
                selectedBenchmark === benchmark
                  ? "bg-zinc-300 text-zinc-900"
                  : "bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setSelectedBenchmark(benchmark)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: benchmarks.indexOf(benchmark) * 0.05,
              }}
            >
              <span className="text-xs md:text-sm whitespace-nowrap">
                {benchmarkDisplayNames[benchmark]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBenchmark}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
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
          <Description benchmark={selectedBenchmark} />
        </motion.div>
      </AnimatePresence>
    </BenchmarkContext.Provider>
  );
}
