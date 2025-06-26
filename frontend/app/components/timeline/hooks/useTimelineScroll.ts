import { useCallback, useEffect } from "react";
import { END_YEAR, START_YEAR, TimelineCard } from "../utils";

export default function useTimelineScroll({
  setTime,
  setProgress,
  setFocusedCardIndex,
  cards,
  focusedCardIndex,
  timelineCardWrapperRef,
  timelineCardRefs,
  debounceTimer,
}: {
  setTime: (time: Date) => void;
  setProgress: (progress: number) => void;
  setFocusedCardIndex: (index: number) => void;
  cards: TimelineCard[];
  focusedCardIndex: number;
  timelineCardWrapperRef: React.RefObject<HTMLDivElement | null>;
  timelineCardRefs: React.RefObject<(HTMLDivElement | null)[]>;
  debounceTimer: React.RefObject<NodeJS.Timeout | null>;
}) {
  const handleScroll = useCallback(() => {
    if (!timelineCardWrapperRef.current) return;

    const viewportCenter = window.innerHeight / 2;

    let closestCardIndex = 0;
    let closestDistance = Infinity;

    timelineCardRefs.current.forEach((cardRef, index) => {
      if (!cardRef) return;

      const cardRect = cardRef.getBoundingClientRect();
      const cardCenter = cardRect.top + cardRect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCardIndex = index;
      }
    });

    if (closestCardIndex !== focusedCardIndex) {
      const focusedCard = cards[closestCardIndex];
      const totalDuration =
        new Date(END_YEAR, 11, 31).getTime() -
        new Date(START_YEAR, 0, 1).getTime();
      const progress =
        (focusedCard.date.getTime() - new Date(START_YEAR, 0, 1).getTime()) /
        totalDuration;

      setTime(focusedCard.date);
      setProgress(Math.min(Math.max(progress, 0), 1));
      setFocusedCardIndex(closestCardIndex);
    }
  }, [focusedCardIndex, cards]);

  // throttled 스크롤 핸들러 (16ms = 60fps)
  const debounceHandleScroll = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleScroll();
    }, 100);
  }, [handleScroll]);   
  
  useEffect(() => {
    window.addEventListener("scroll", debounceHandleScroll);

    return () => {
      window.removeEventListener("scroll", debounceHandleScroll);
    };
  }, [debounceHandleScroll, handleScroll]);
}