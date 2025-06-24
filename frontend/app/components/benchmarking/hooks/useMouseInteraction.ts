import { useCallback, useState, useEffect, useRef } from "react";
import { ScatterPlotData, Position, DataPoint, BoxPlotData, BoxPlotDataPoint } from "../types";
import { findPointAtPosition, findBoxPlotPointAtPosition } from "../utils";

export const useMouseInteraction = () => {
  const rectRef = useRef<HTMLDivElement>(null);
  
  // 호버 상태 관리
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPlotData | null>(null);
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  
  // 툴팁 고정 상태 관리
  const [pinnedPoint, setPinnedPoint] = useState<ScatterPlotData | null>(null);
  const [pinnedPosition, setPinnedPosition] = useState<Position | null>(null);

  // 마우스 호버 이벤트 핸들러
  const handleMouseMove = useCallback((
    event: React.MouseEvent<HTMLDivElement>,
    dataPointsRef: React.MutableRefObject<DataPoint[]>
  ) => {
    if (!rectRef.current) return;

    const rect = rectRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 고정된 상태가 아닐 때만 마우스 위치 업데이트
    if (!pinnedPoint) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }

    // 마우스 위치에서 가장 가까운 데이터 포인트 찾기
    const hoveredPoint = findPointAtPosition(dataPointsRef.current, mouseX, mouseY);

    // 고정된 상태가 아닐 때만 호버 상태 업데이트
    if (!pinnedPoint) {
      if (hoveredPoint) {
        setHoveredPoint(hoveredPoint.data);
      } else {
        setHoveredPoint(null);
      }
    }
  }, [pinnedPoint]);

  // 데이터 포인트 클릭 핸들러
  const handleDataPointClick = useCallback((
    event: React.MouseEvent<HTMLDivElement>,
    dataPointsRef: React.MutableRefObject<DataPoint[]>
  ) => {
    if (!rectRef.current) return;

    const rect = rectRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // 클릭된 위치에서 가장 가까운 데이터 포인트 찾기
    const clickedPoint = findPointAtPosition(dataPointsRef.current, clickX, clickY);

    if (clickedPoint) {
      // 툴팁 고정
      setPinnedPoint(clickedPoint.data);
      setPinnedPosition({ x: event.clientX, y: event.clientY });
      setHoveredPoint(clickedPoint.data);
      event.stopPropagation(); // 이벤트 버블링 방지
    }
  }, []);

  // 다른 곳 클릭 시 고정 해제
  const handleDocumentClick = useCallback((event: MouseEvent) => {
    // 툴팁 영역이 아닌 곳을 클릭했을 때만 고정 해제
    const target = event.target as HTMLElement;
    const isTooltipClick = target.closest('.tooltip-container');
    
    if (!isTooltipClick && pinnedPoint) {
      setPinnedPoint(null);
      setPinnedPosition(null);
      setHoveredPoint(null);
      setMousePosition(null);
    }
  }, [pinnedPoint]);

  // 툴팁 내부 클릭 핸들러
  const handleTooltipClick = useCallback((event: React.MouseEvent) => {
    // 툴팁 내부 클릭 시 고정 해제 방지
    event.stopPropagation();
  }, []);

  // 마우스가 영역을 벗어날 때
  const handleMouseLeave = useCallback(() => {
    // 고정된 상태가 아닐 때만 호버 해제
    if (!pinnedPoint) {
      setHoveredPoint(null);
      setMousePosition(null);
    }
  }, [pinnedPoint]);

  // 문서 클릭 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return {
    rectRef,
    hoveredPoint,
    mousePosition,
    pinnedPoint,
    pinnedPosition,
    handleMouseMove,
    handleDataPointClick,
    handleTooltipClick,
    handleMouseLeave,
  };
};

export const useBoxPlotMouseInteraction = () => {
  const rectRef = useRef<HTMLDivElement>(null);
  
  const [hoveredPoint, setHoveredPoint] = useState<BoxPlotData | null>(null);
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  
  const [pinnedPoint, setPinnedPoint] = useState<BoxPlotData | null>(null);
  const [pinnedPosition, setPinnedPosition] = useState<Position | null>(null);

  const handleMouseMove = useCallback((
    event: React.MouseEvent<HTMLDivElement>,
    dataPointsRef: React.MutableRefObject<BoxPlotDataPoint[]>
  ) => {
    if (!rectRef.current) return;

    const rect = rectRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (!pinnedPoint) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }

    const hoveredPoint = findBoxPlotPointAtPosition(dataPointsRef.current, mouseX, mouseY);

    if (!pinnedPoint) {
      if (hoveredPoint) {
        setHoveredPoint(hoveredPoint.data);
      } else {
        setHoveredPoint(null);
      }
    }
  }, [pinnedPoint]);

  const handleDataPointClick = useCallback((
    event: React.MouseEvent<HTMLDivElement>,
    dataPointsRef: React.MutableRefObject<BoxPlotDataPoint[]>
  ) => {
    if (!rectRef.current) return;

    const rect = rectRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const clickedPoint = findBoxPlotPointAtPosition(dataPointsRef.current, clickX, clickY);

    if (clickedPoint) {
      setPinnedPoint(clickedPoint.data);
      setPinnedPosition({ x: event.clientX, y: event.clientY });
      setHoveredPoint(clickedPoint.data);
      event.stopPropagation(); // 이벤트 버블링 방지
    }
  }, []);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isTooltipClick = target.closest('.tooltip-container');
    
    if (!isTooltipClick && pinnedPoint) {
      setPinnedPoint(null);
      setPinnedPosition(null);
      setHoveredPoint(null);
      setMousePosition(null);
    }
  }, [pinnedPoint]);

  const handleTooltipClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!pinnedPoint) {
      setHoveredPoint(null);
      setMousePosition(null);
    }
  }, [pinnedPoint]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  return {
    rectRef,
    hoveredPoint,
    mousePosition,
    pinnedPoint,
    pinnedPosition,
    handleMouseMove,
    handleDataPointClick,
    handleTooltipClick,
    handleMouseLeave,
  };
}; 