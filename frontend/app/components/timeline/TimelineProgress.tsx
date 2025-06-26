import { forwardRef } from "react";
import { motion } from "motion/react";

const TimelineProgress = forwardRef<
  HTMLDivElement,
  {
    top: number;
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
  }
>(({ top, onClick, onMouseMove, onMouseLeave, onMouseEnter }, ref) => {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 border-l-1 px-4 border-l-gray-200 
        h-[calc(100%+140px)] transition-all duration-150"
        ref={ref}
        style={{ top: top }}
        initial={{ transform: "scaleY(0)", transformOrigin: "0% 0%" }}
        animate={{ transform: "scaleY(1)", transformOrigin: "0% 0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      ></motion.div>
      <div
        className="absolute top-0 -left-18 w-32 z-30 cursor-pointer shadow-lg transition-all duration-150 h-[calc(100%+140px)]"
        style={{
          top: top,
        }}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      />
    </>
  );
});

export default TimelineProgress;
