import { useCallback, useRef, useEffect } from "react";
import { ScatterPlotData, Margin, DataPoint, ModelLabel, BoxPlotData, BoxPlotDataPoint, BoxPlotModelLabel } from "../types";
import { CanvasRenderer } from "../canvas-renderer";

export const useCanvasRendering = (
  width: number,
  height: number,
  margin: Margin,
  data: ScatterPlotData[],
  hoveredPoint: ScatterPlotData | null,
  pinnedPoint: ScatterPlotData | null,
  isMounted: boolean,
  postfix: string = "%"
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dataPointsRef = useRef<DataPoint[]>([]);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const labelColor = "#9ca3af";

  // Canvas 렌더링 함수
  const renderCanvas = useCallback(
    (canvas: HTMLCanvasElement, xScale: any, yScale: any) => {
      if (!rendererRef.current) {
        rendererRef.current = new CanvasRenderer(canvas, width, height, margin, labelColor, postfix);
      }

      const renderer = rendererRef.current;
      renderer.setupCanvas();
      renderer.drawGridAndAxes(xScale, yScale);
      renderer.setupClipping();

      // 데이터 포인트 위치 정보 초기화
      dataPointsRef.current = [];

      // 데이터 포인트 렌더링
      data.forEach((point) => {
        const x = xScale(point.x) + margin.left;
        const y = yScale(point.y) + margin.top;
        const radius = 4;

        // 뷰포트 내에 있는 포인트만 렌더링 (성능 최적화)
        if (renderer.isPointInViewport(x, y)) {
                     const isHovered = !!(hoveredPoint && hoveredPoint.id === point.id) || 
                            !!(pinnedPoint && pinnedPoint.id === point.id);
           const shouldDimOthers = !!(hoveredPoint || pinnedPoint) && !isHovered;

          renderer.drawDataPoint(point, x, y, radius, isHovered, shouldDimOthers);

          // 클릭 감지를 위해 데이터 포인트 위치 저장
          dataPointsRef.current.push({
            x,
            y,
            data: point,
            radius: radius + 5, // 클릭 감지 영역을 조금 더 크게
          });
        }
      });

      renderer.restoreContext();

      // 모델 레이블 수집
      const modelLabels = new Map<string, ModelLabel>();
      data.forEach((point) => {
        if (!modelLabels.has(point.id)) {
          const x = xScale(point.x) + margin.left;
          const y = yScale(point.y) + margin.top;
          if (x >= margin.left && x <= width - margin.right && 
              y >= margin.top && y <= height - margin.bottom) {
            modelLabels.set(point.id, {
              x,
              y,
              color: point.color,
              data: point,
              label: point.label,
            });
          }
        }
      });

      // 레이블 렌더링
      renderer.drawModelLabels(modelLabels, hoveredPoint, pinnedPoint);
    },
    [data, width, height, margin, innerWidth, innerHeight, hoveredPoint, pinnedPoint, labelColor]
  );

  // 캔버스 업데이트 함수 (애니메이션 프레임 사용)
  const updateCanvas = useCallback(
    (xScale: any, yScale: any) => {
      if (!isMounted) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (canvasRef.current) {
          renderCanvas(canvasRef.current, xScale, yScale);
        }
      });
    },
    [renderCanvas, isMounted]
  );

  // 컴포넌트 언마운트 시 애니메이션 프레임 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    dataPointsRef,
    updateCanvas,
  };
};

export const useBoxPlotCanvasRendering = (
  width: number,
  height: number,
  margin: Margin,
  data: BoxPlotData[],
  hoveredPoint: BoxPlotData | null,
  pinnedPoint: BoxPlotData | null,
  isMounted: boolean
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dataPointsRef = useRef<BoxPlotDataPoint[]>([]);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const labelColor = "#9ca3af";

  // Canvas 렌더링 함수
  const renderCanvas = useCallback(
    (canvas: HTMLCanvasElement, xScale: any, yScale: any) => {
      if (!rendererRef.current) {
        rendererRef.current = new CanvasRenderer(canvas, width, height, margin, labelColor);
      }

      const renderer = rendererRef.current;
      renderer.setupCanvas();
      renderer.drawGridAndAxes(xScale, yScale);
      renderer.setupClipping();

      // 데이터 포인트 위치 정보 초기화
      dataPointsRef.current = [];

      // 박스플롯 데이터 포인트 렌더링
      data.forEach((point) => {
        const x = xScale(point.x) + margin.left;
        const y = yScale(point.y) + margin.top;
        const radius = 4;

        // 뷰포트 내에 있는 포인트만 렌더링
        if (renderer.isPointInViewport(x, y)) {
          const isHovered = !!(hoveredPoint && hoveredPoint.id === point.id) || 
                           !!(pinnedPoint && pinnedPoint.id === point.id);
          const shouldDimOthers = !!(hoveredPoint || pinnedPoint) && !isHovered;

          // 박스플롯 렌더링
          renderer.drawBoxPlot(point, x, yScale(point.y), yScale, isHovered, shouldDimOthers);

          // 클릭 감지를 위해 데이터 포인트 위치 저장
          dataPointsRef.current.push({
            x,
            y,
            data: point,
            radius,
          });
        }
      });

      renderer.restoreContext();

      // 모델 레이블 수집
      const modelLabels = new Map<string, BoxPlotModelLabel>();
      data.forEach((point) => {
        if (!modelLabels.has(point.id)) {
          const x = xScale(point.x) + margin.left;
          const y = yScale(point.y) + margin.top;
          if (x >= margin.left && x <= width - margin.right && 
              y >= margin.top && y <= height - margin.bottom) {
            modelLabels.set(point.id, {
              x,
              y,
              color: point.color,
              data: point,
              label: point.label,
            });
          }
        }
      });

      // 레이블 렌더링
      renderer.drawBoxPlotModelLabels(modelLabels, hoveredPoint, pinnedPoint);
    },
    [data, width, height, margin, innerWidth, innerHeight, hoveredPoint, pinnedPoint, labelColor]
  );

  // 캔버스 업데이트 함수
  const updateCanvas = useCallback(
    (xScale: any, yScale: any) => {
      if (!isMounted) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (canvasRef.current) {
          renderCanvas(canvasRef.current, xScale, yScale);
        }
      });
    },
    [renderCanvas, isMounted]
  );

  // 컴포넌트 언마운트 시 애니메이션 프레임 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    dataPointsRef,
    updateCanvas,
  };
}; 