import Link from "next/link";
import { TimelineSvg } from "./TimelineSvg";

export default function TimelineBanner() {
  return (
    <Link
      className="relative w-full h-24 overflow-hidden flex flex-col items-center justify-center bg-indigo-800/20
        rounded-3xl cursor-pointer border-2 border-indigo-800/20 shadow-2xl
        hover:border-indigo-800/20 hover:shadow-indigo-800/20 transition-all duration-150
    "
      href="/timeline"
    >
      <h1
        className="text-3xl text-cyan-200/90 z-10
      text-shadow-[rgba(255, 255, 255, 0.5)]"
      >
        2015-2025 인공지능 타임라인
      </h1>
      <p className="text-xs text-cyan-100 z-10">
        클릭하여 타임라인 페이지로 이동
      </p>
      <TimelineSvg className="absolute w-full h-128" />
    </Link>
  );
}


