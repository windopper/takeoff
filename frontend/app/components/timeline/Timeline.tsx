'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import TimelineCard from "./TimelineCard";
import TimelineProgress from "./TimelineProgress";
import TimelineYear from "./TimelineYear";
import TimelineIndicator from "./TimelineIndicator";
import { CATEGORIES, TIMELINE_DATA } from "@/data/timelineData";
import TimelineCategories from "./TimelineCategories";

const STARTYEAR = 2015;
const ENDYEAR = 2025;

const cards = TIMELINE_DATA.events.map((event) => {
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

export default function Timeline() {
  const [time, setTime] = useState(new Date(ENDYEAR, 0, 1));
  const [progress, setProgress] = useState(0.2);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CATEGORIES[]>(Object.values(CATEGORIES));
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const yearProgressHeight = (ENDYEAR - STARTYEAR + 1) * 32 * 4;
  const maxStyleTopHeight = timelineProgressRef.current?.clientHeight
    ? yearProgressHeight - timelineProgressRef.current.clientHeight + 140
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

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!cardsRef.current) return;

    const viewportCenter = window.innerHeight / 2;
    
    let closestCardIndex = 0;
    let closestDistance = Infinity;

    cardRefs.current.forEach((cardRef, index) => {
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
      const totalDuration = new Date(ENDYEAR, 11, 31).getTime() - new Date(STARTYEAR, 0, 1).getTime();
      const progress = (focusedCard.date.getTime() - new Date(STARTYEAR, 0, 1).getTime()) / totalDuration;
      
      setTime(focusedCard.date);
      setProgress(Math.min(Math.max(progress, 0), 1));
      setFocusedCardIndex(closestCardIndex);
    }
  }, [focusedCardIndex, cards]);

  // throttled 스크롤 핸들러 (16ms = 60fps)
  const debounceHandleScroll = useCallback(
    () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        handleScroll();
      }, 100);
    },
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', debounceHandleScroll);

    return () => {
      window.removeEventListener('scroll', debounceHandleScroll);
    };
  }, [debounceHandleScroll, handleScroll]);

  return (
    <div className="flex flex-col items-center gap-4">
      <TimelineCategories setSelectedCategories={setSelectedCategories} categories={selectedCategories} />
      <div className="relative flex-row justify-center mt-24 gap-4 flex">
        <div className="sticky top-10 pl-6 h-[calc(100vh-120px)] -z-10 hidden sm:block">
          <div
            className="relative h-full transition-all duration-150"
            style={{ top: -maxStyleTopHeight * progress }}
          >
            <TimelineProgress
              ref={timelineProgressRef}
              top={maxStyleTopHeight * progress - 70}
            />
            <TimelineIndicator
              progress={progress}
              top={maxStyleTopHeight * progress + 16}
            />
            <TimelineYear
              startYear={STARTYEAR}
              endYear={ENDYEAR}
              progress={progress}
              currentYear={time.getFullYear()}
              currentMonth={time.getMonth() + 1}
            />
          </div>
        </div>
        <div className="flex flex-col sm:min-w-xl gap-8 sm:ml-12 ml-0" ref={cardsRef}>
          {cards.map((card, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="px-4"
            >
              <TimelineCard
                title={card.text.headline.text}
                description={card.korean.text}
                category={card.category}
                link={card.korean.headline.url}
                date={card.date.toLocaleDateString()}
                isFocused={index === focusedCardIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
