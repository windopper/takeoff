import { localPoint } from "@visx/event";
import { Zoom } from "@visx/zoom";
import { useEffect, useMemo, useState } from "react";

// 분리된 모듈들 import
import { ScatterPlotProps, Margin } from "./types";
import { createInitialXScale, createInitialYScale } from "./utils";
import { useCanvasRendering } from "./hooks/useCanvasRendering";
import { useMouseInteraction } from "./hooks/useMouseInteraction";
import { useZoomConstraints } from "./hooks/useZoomConstraints";
import { Tooltip } from "./components/Tooltip";

export default function ScatterPlot({
  width = 1200,
  height = 550,
  data,
  yAxisPostfix = "%",
}: ScatterPlotProps) {
  const [isMounted, setIsMounted] = useState(false);

  // 마진 설정
  const margin: Margin = { top: 20, right: 60, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 초기 스케일 생성
  const initialXScale = useMemo(
    () => createInitialXScale(data, innerWidth),
    [data, innerWidth]
  );

  const initialYScale = useMemo(
    () => createInitialYScale(data, innerHeight),
    [data, innerHeight]
  );

  // 커스텀 훅들 사용
  const {
    rectRef,
    hoveredPoint,
    mousePosition,
    pinnedPoint,
    pinnedPosition,
    handleMouseMove,
    handleDataPointClick,
    handleTooltipClick,
    handleMouseLeave,
  } = useMouseInteraction();

  const { canvasRef, dataPointsRef, updateCanvas } = useCanvasRendering(
    width,
    height,
    margin,
    data,
    hoveredPoint,
    pinnedPoint,
    isMounted,
    yAxisPostfix
  );

  const { constrainTransform } = useZoomConstraints(
    data,
    innerWidth,
    innerHeight,
    initialXScale,
    initialYScale
  );

  // 마운트 상태 관리 및 휠 이벤트 처리
  useEffect(() => {
    setIsMounted(true);

    const handleWheel = (event: WheelEvent) => {
      if (rectRef.current) {
        // 휠 이벤트가 상호작용 영역 밖에서 발생하면 무시
        if (event.target !== rectRef.current) {
          return;
        }

        const rect = rectRef.current.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // if (!isMounted) {
  //   return (
  //     <div
  //       className={` bg-transparent p-4 flex items-center justify-center`}
  //       style={{ width: width, height: height }}
  //     >
  //       <div className="text-gray-500">Loading chart...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full bg-transparent p-4">
      <div className="relative">
        <Zoom<HTMLDivElement>
          width={innerWidth}
          height={innerHeight}
          scaleXMax={4}
          scaleYMax={4}
          scaleXMin={1}
          scaleYMin={1}
          constrain={constrainTransform}
          initialTransformMatrix={{
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            skewX: 0,
            skewY: 0,
          }}
        >
          {(zoom) => {
            // 줌 변환된 스케일 계산
            const fixedXScale = zoom.transformMatrix
              ? initialXScale
                  .copy()
                  .domain([
                    initialXScale.invert(
                      -zoom.transformMatrix.translateX /
                        zoom.transformMatrix.scaleX
                    ),
                    initialXScale.invert(
                      (innerWidth - zoom.transformMatrix.translateX) /
                        zoom.transformMatrix.scaleX
                    ),
                  ])
              : initialXScale;

            const fixedYScale = zoom.transformMatrix
              ? initialYScale
                  .copy()
                  .domain([
                    initialYScale.invert(
                      (innerHeight - zoom.transformMatrix.translateY) /
                        zoom.transformMatrix.scaleY
                    ),
                    initialYScale.invert(
                      -zoom.transformMatrix.translateY /
                        zoom.transformMatrix.scaleY
                    ),
                  ])
              : initialYScale;

            // 캔버스 업데이트
            updateCanvas(fixedXScale, fixedYScale);

            return (
              <div className="relative flex items-center justify-center">
                {/* Canvas 레이어 */}
                <canvas
                  ref={canvasRef}
                  style={{
                    width: width,
                    height: height,
                    display: "block",
                  }}
                />

                {/* 상호작용 영역 */}
                <div
                  ref={rectRef}
                  style={{
                    position: "absolute",
                    width: width,
                    height: height,
                  }}
                  onTouchStart={zoom.dragStart}
                  onTouchMove={zoom.dragMove}
                  onTouchEnd={zoom.dragEnd}
                  onMouseDown={zoom.dragStart}
                  onMouseMove={(event) => {
                    zoom.dragMove(event);
                    handleMouseMove(event, dataPointsRef);
                  }}
                  onMouseUp={zoom.dragEnd}
                  onMouseLeave={() => {
                    if (zoom.isDragging) {
                      zoom.dragEnd();
                    }
                    handleMouseLeave();
                  }}
                  onClick={(event) =>
                    handleDataPointClick(event, dataPointsRef)
                  }
                  onWheel={(event) => {
                    const point = localPoint(event) || {
                      x: innerWidth / 2,
                      y: innerHeight / 2,
                    };
                    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
                    zoom.scale({
                      scaleX: scaleFactor,
                      scaleY: scaleFactor,
                      point: {
                        x: point.x - margin.left,
                        y: point.y - margin.top,
                      },
                    });
                  }}
                  onDoubleClick={(event) => {
                    zoom.reset();
                  }}
                />

                {/* 툴팁 */}
                {(hoveredPoint || pinnedPoint) &&
                  (mousePosition || pinnedPosition) && (
                    <Tooltip
                      point={(pinnedPoint || hoveredPoint)!}
                      position={(pinnedPosition || mousePosition)!}
                      onTooltipClick={handleTooltipClick}
                    />
                  )}
              </div>
            );
          }}
        </Zoom>
      </div>
    </div>
  );
}
