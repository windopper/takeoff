"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import TimelineCard from "./TimelineCard";
import TimelineProgress from "./TimelineProgress";
import TimelineYear from "./TimelineYear";
import TimelineIndicator from "./TimelineIndicator";
import { CATEGORIES, TIMELINE_DATA } from "@/data/timelineData";
import TimelineCategories from "./TimelineCategories";
import TimelineHero from "./TimelineHero";
import { motion } from "motion/react";
import { END_YEAR, START_YEAR } from "./utils";
import useTimelineScroll from "./hooks/useTimelineScroll";
import useTimelineCardClick from "./hooks/useTimelineCardClick";

export default function Timeline() {
  const [time, setTime] = useState(new Date(END_YEAR, 0, 1));
  const [progress, setProgress] = useState(0.2);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CATEGORIES[]>(
    Object.values(CATEGORIES)
  );
  const timelineCardWrapperRef = useRef<HTMLDivElement>(null);
  const timelineCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const mouseHoverRef = useRef<HTMLDivElement>(null);

  const yearProgressHeight = (END_YEAR - START_YEAR + 1) * 32 * 4;
  const maxStyleTopHeight = timelineProgressRef.current?.getBoundingClientRect()
    .height
    ? yearProgressHeight -
      timelineProgressRef.current.getBoundingClientRect().height +
      140
    : 0;

  const cards = useMemo(() => {
    return TIMELINE_DATA.events
      .filter((event) => selectedCategories.includes(event.category))
      .map((event) => {
        const date = new Date(
          parseInt(event.start_date.year),
          parseInt(event.start_date.month) - 1,
          parseInt(event.start_date.day)
        );
        return {
          ...event,
          date,
        };
      });
  }, [selectedCategories]);

  useTimelineScroll({
    setTime,
    setProgress,
    setFocusedCardIndex,
    cards,
    focusedCardIndex,
    timelineCardWrapperRef,
    timelineCardRefs,
    debounceTimer,
  });

  const { handleClickProgress } = useTimelineCardClick({
    timelineCardRefs,
    timelineProgressRef,
    cards,
    yearProgressHeight,
    setTime,
    setProgress,
    setFocusedCardIndex,
  })

  const displayMouseHoverEffect = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      handleMouseEnter();
      const rect = event.currentTarget.getBoundingClientRect();
      const y = event.clientY - rect.top;
      mouseHoverRef.current?.style.setProperty(
        "top",
        `${y + maxStyleTopHeight * progress - 70 - 24}px`
      );
    },
    [maxStyleTopHeight, progress]
  );

  const handleMouseLeave = useCallback(() => {
    mouseHoverRef.current?.style.setProperty("opacity", "0");
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseHoverRef.current?.style.setProperty("opacity", "1");
  }, []);

  return (
    <motion.div className="flex flex-col items-center gap-4">
      <motion.div
        className="flex flex-col items-center w-full backdrop-blur-3xl"
        initial={{ opacity: 0, y: 10, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, y: 0, backdropFilter: "blur(32px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <TimelineHero />
        <TimelineCategories
          setSelectedCategories={setSelectedCategories}
          categories={selectedCategories}
        />
      </motion.div>
      <div className="relative flex-row justify-center mt-24 gap-4 flex">
        <div className="sticky top-10 pl-6 h-[calc(100vh-120px)] z-10 hidden sm:block">
          <div
            className="relative h-full transition-all duration-150"
            style={{ top: -maxStyleTopHeight * progress }}
          >
            <div
              className="pointer-events-none absolute top-0 -left-1.5 w-3 h-12 
              bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 ease-in-out"
              ref={mouseHoverRef}
            ></div>
            <TimelineProgress
              ref={timelineProgressRef}
              top={maxStyleTopHeight * progress - 70}
              onClick={(e) => {
                handleClickProgress(e);
                handleMouseLeave();
              }}
              onMouseMove={displayMouseHoverEffect}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            />
            <TimelineIndicator
              progress={progress}
              top={maxStyleTopHeight * progress + 16}
            />
            <TimelineYear
              startYear={START_YEAR}
              endYear={END_YEAR}
              currentYear={time.getFullYear()}
              currentMonth={time.getMonth() + 1}
            />
          </div>
        </div>
        <div
          className="flex flex-col sm:min-w-xl gap-8 sm:ml-12 ml-0"
          ref={timelineCardWrapperRef}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                timelineCardRefs.current[index] = el;
              }}
              className="px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            >
              <TimelineCard
                title={card.text.headline.text}
                description={card.korean.text}
                category={card.category}
                link={card.korean.headline.url}
                date={card.date.toLocaleDateString()}
                isFocused={index === focusedCardIndex}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
