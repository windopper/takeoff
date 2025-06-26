import { useCallback } from "react";
import { START_YEAR, TimelineCard } from "../utils";
import { END_YEAR } from "../utils";

export default function useTimelineCardClick({
  timelineProgressRef,
  cards,
  yearProgressHeight,
  setTime,
  setProgress,
  setFocusedCardIndex,
  timelineCardRefs,
}: {
  timelineCardRefs: React.RefObject<(HTMLDivElement | null)[]>;
  timelineProgressRef: React.RefObject<HTMLDivElement | null>;
  cards: TimelineCard[];
  yearProgressHeight: number;
  setTime: (time: Date) => void;
  setProgress: (progress: number) => void;
  setFocusedCardIndex: (index: number) => void;
}) {
  const handleClickProgress = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // 프로그레스 바 컨테이너 찾기
      const movingContainer = timelineProgressRef.current?.parentElement;
      if (!movingContainer) return;

      // 클릭 위치 계산
      const movingContainerRect = movingContainer.getBoundingClientRect();
      const clickY = event.clientY - movingContainerRect.top;

      // 클릭 위치를 토대로 TimelineYear의 요소 중 어디에 위치하는지 계산
      const relativeProgress = Math.min(
        Math.max(clickY / yearProgressHeight, 0),
        1
      );

      const totalMs =
        new Date(END_YEAR, 11, 31).getTime() -
        new Date(START_YEAR, 0, 1).getTime();
      const startMs = new Date(START_YEAR, 0, 1).getTime();
      const targetMs = startMs + totalMs * relativeProgress;
      const targetDate = new Date(targetMs);

      // 가장 가까운 카드 인덱스 찾기
      let closestCardIndex = -1;
      let minDiff = Infinity;
      cards.forEach((card, index) => {
        const diff = Math.abs(card.date.getTime() - targetDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestCardIndex = index;
        }
      });

      if (closestCardIndex === -1) return;

      const finalCard = cards[closestCardIndex];
      const finalProgress = (finalCard.date.getTime() - startMs) / totalMs;

      setTime(finalCard.date);
      setProgress(Math.min(Math.max(finalProgress, 0), 1));
      setFocusedCardIndex(closestCardIndex);

      timelineCardRefs.current[closestCardIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    },
    [cards, yearProgressHeight]
  );

  return {
    handleClickProgress,
  };
}
