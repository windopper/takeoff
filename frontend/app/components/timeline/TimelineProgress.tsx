import { forwardRef } from "react";

const TimelineProgress = forwardRef<HTMLDivElement, { top: number }>(({ top }, ref) => {
    return (
      <div
        className="absolute top-0 left-0 border-l-1 border-l-gray-200 h-[calc(100%+140px)] transition-all duration-150"
        ref={ref}
        style={{ top: top }}
      />
    );
});

export default TimelineProgress;