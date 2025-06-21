'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import TimelineCard from "./TimelineCard";
import TimelineProgress from "./TimelineProgress";
import TimelineYear from "./TimelineYear";
import TimelineIndicator from "./TimelineIndicator";

const STARTYEAR = 2015;
const ENDYEAR = 2025;

const randomDateBetween = (startYear: number, endYear: number) => {
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(endYear, 11, 31);
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

// throttle 함수
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export default function Timeline() {
  const [time, setTime] = useState(new Date(ENDYEAR, 0, 1));
  const [progress, setProgress] = useState(0.2);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const yearProgressHeight = (ENDYEAR - STARTYEAR + 1) * 32 * 4;
  const maxStyleTopHeight = timelineProgressRef.current?.clientHeight
    ? yearProgressHeight - timelineProgressRef.current.clientHeight + 140
    : 0;

  // 카드 데이터 생성 (메모이제이션)
  const cards = useMemo(() => {
    const cardData: Date[] = [];
    for (let i = 0; i < 100; i++) {
      cardData.push(randomDateBetween(STARTYEAR, ENDYEAR));
    }
    return cardData.sort((a, b) => a.getTime() - b.getTime());
  }, []);

  // 카드 배열 초기화
  cardRefs.current = cardRefs.current.slice(0, cards.length);

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
      const progress = (focusedCard.getTime() - new Date(STARTYEAR, 0, 1).getTime()) / totalDuration;
      
      setTime(focusedCard);
      setProgress(Math.min(Math.max(progress, 0), 1));
      setFocusedCardIndex(closestCardIndex);
    }
  }, [focusedCardIndex, cards]);

  // throttled 스크롤 핸들러 (16ms = 60fps)
  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 500),
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // 초기 실행

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll, handleScroll]);

  return (
    <div className="relative flex flex-row justify-center mt-24 gap-4">
      <div className="sticky top-24 pl-6 h-[calc(100vh-120px)]">
        <div className="relative h-full" style={{ top: 10 - maxStyleTopHeight * progress }}> 
          <TimelineProgress ref={timelineProgressRef} top={maxStyleTopHeight * progress} />
          <TimelineIndicator progress={progress} top={maxStyleTopHeight * progress + 16} />
          <TimelineYear
            startYear={STARTYEAR} 
            endYear={ENDYEAR} 
            progress={progress}
            currentYear={time.getFullYear()}
            currentMonth={time.getMonth() + 1}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8 ml-16" ref={cardsRef}>
        {cards.map((card, index) => (
          <div 
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          >
            <TimelineCard
              title="Timeline Card"
              description="Timeline Card Description"
              link="https://www.google.com"
              date={card.toLocaleDateString()}
              isFocused={index === focusedCardIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
