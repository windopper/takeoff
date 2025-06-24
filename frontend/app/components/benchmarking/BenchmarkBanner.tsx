import Link from "next/link";
import Background from "./Background";

export default function BenchmarkBanner() {
  return (
    <Link
      className="relative w-full h-24 overflow-hidden flex flex-col items-center justify-center bg-purple-800/20
        rounded-3xl cursor-pointer border-2 border-purple-800/20 shadow-2xl
        hover:border-purple-800/20 hover:shadow-purple-800/20 transition-all duration-150
    "
      href="/benchmarking"
    >
      <h1
        className="text-3xl text-purple-200/90 z-10
      text-shadow-[rgba(255, 255, 255, 0.5)]"
      >
        인공지능 벤치마크
      </h1>
      <p className="text-xs text-purple-100 z-10">
        클릭하여 벤치마크 페이지로 이동
      </p>
      <Background className="absolute w-full h-128" />
    </Link>
  );
}


