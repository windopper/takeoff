import { motion } from "motion/react"

  // progress 0.0 - 1.0
export default function TimelineIndicator({ progress, top }: { progress: number, top: number }) {
    return (
      <motion.div
        className="absolute rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2
         w-4 h-4 bg-white shadow-lg transition-all duration-150"
        style={{
          boxShadow: "rgba(255, 255, 255, 0.5) 0px 0px 10px",
          top: `calc(${progress * 100}% + ${top}px)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    );
}   