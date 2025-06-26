import { motion } from "motion/react";

export default function TimelineHero() {
  return (
    <motion.div className="mt-16 pt-16 h-64 p-4 flex items-center justify-center w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center justify-center p-2">
        <motion.h1 className="sm:text-4xl text-2xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          2015-2025 AI 타임라인
        </motion.h1>

        <motion.div className="sm:text-sm text-xs text-zinc-500 mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          2015년부터 2025년까지 인공지능의 기술, 정책, 문화 등 다양한 분야에서 일어난 일들을 시간순으로 정리했습니다.
          <br />각 항목의 링크를 통해 관련 원본 문서를 확인하실 수 있습니다.
          <motion.p className="sm:text-xs text-xs text-zinc-500 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            모든 사건은 주관적 기준으로 선별되었으며, 일부 중요한 사건이 누락될
            수 있습니다.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
