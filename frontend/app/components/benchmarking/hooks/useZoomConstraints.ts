import { useMemo } from "react";
import { ScatterPlotData, AxisLimits, BoxPlotData } from "../types";
import { calculateAxisLimits } from "../utils";
import { Transform } from "stream";

export const MIN_SCALE = 1;
export const MAX_SCALE = 8;

export const useZoomConstraints = <T extends ScatterPlotData | BoxPlotData>(
  data: T[],
  innerWidth: number,
  innerHeight: number,
  initialXScale: any,
  initialYScale: any
) => {
  const { xAxisLimits, yAxisLimits } = useMemo(() => {
    if (data.length === 0) {
      return {
        xAxisLimits: { min: new Date(), max: new Date() },
        yAxisLimits: { min: 0, max: 100 }
      };
    }

    const isBoxPlotData = (item: T): item is T & BoxPlotData => 'stderr' in item;
    
    if (isBoxPlotData(data[0])) {
      const boxPlotData = data as BoxPlotData[];
      const allValues: number[] = [];
      boxPlotData.forEach(d => {
        allValues.push(d.y + d.stderr);
        allValues.push(d.y - d.stderr);
      });
      
      const minDate = Math.min(...boxPlotData.map((d) => d.x.getTime()));
      const maxDate = Math.max(...boxPlotData.map((d) => d.x.getTime()));
      const dateRange = maxDate - minDate;
      const datePadding = dateRange * 0.1;
      
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const valueRange = maxValue - minValue;
      const valuePadding = Math.max(valueRange * 0.1, 5);
      
      return {
        xAxisLimits: {
          min: new Date(minDate - datePadding),
          max: new Date(maxDate + datePadding),
        },
        yAxisLimits: {
          min: minValue - valuePadding,
          max: maxValue + valuePadding,
        }
      };
    } else {
      return calculateAxisLimits(data as ScatterPlotData[]);
    }
  }, [data]);

  const constrainTransform = (transform: any, prevTransform: any) => {
    let newTransform = { ...transform };
    
    if (transform.scaleX < MIN_SCALE || transform.scaleY < MIN_SCALE) {
      return {
        ...transform,
        scaleX: MIN_SCALE,
        scaleY: MIN_SCALE,
        translateX: 0,
        translateY: 0,
      };
    }

    if (transform.scaleX === MIN_SCALE || transform.scaleY === MIN_SCALE) {
      return {
        ...transform,
        scaleX: MIN_SCALE,
        scaleY: MIN_SCALE,
        translateX: 0,
        translateY: 0,
      }
    }

    // 현재 transform 값 (조정 전)
    const currentScaleX = transform.scaleX;
    const currentScaleY = transform.scaleY;
    const currentTranslateX = transform.translateX;
    const currentTranslateY = transform.translateY;

    // 화면 중심에 현재 어떤 데이터가 있는지 계산
    const viewportCenterX = innerWidth / 2;
    const viewportCenterY = innerHeight / 2;

    // 화면 중심에 해당하는 데이터 좌표 (스케일 조정 전 기준)
    const dataAtViewportCenterX = initialXScale.invert((viewportCenterX - currentTranslateX) / currentScaleX);
    const dataAtViewportCenterY = initialYScale.invert((viewportCenterY - currentTranslateY) / currentScaleY);

    // 스케일 값을 최소/최대 범위로 제한
    newTransform.scaleX = Math.max(MIN_SCALE, Math.min(currentScaleX, MAX_SCALE));
    newTransform.scaleY = Math.max(MIN_SCALE, Math.min(currentScaleY, MAX_SCALE));

    // 제한된 새 스케일 값을 사용하여, 이전의 화면 중심 데이터가 계속 화면 중심에 위치하도록 translateX, translateY 재계산
    newTransform.translateX = viewportCenterX - initialXScale(dataAtViewportCenterX) * newTransform.scaleX;
    newTransform.translateY = viewportCenterY - initialYScale(dataAtViewportCenterY) * newTransform.scaleY;

    // X축 경계 체크 및 최종 translate 조정
    const xDomainMin = initialXScale.invert(-newTransform.translateX / newTransform.scaleX);
    const xDomainMax = initialXScale.invert((innerWidth - newTransform.translateX) / newTransform.scaleX);

    if (xDomainMin < xAxisLimits.min) {
      newTransform.translateX = -initialXScale(xAxisLimits.min) * newTransform.scaleX;
    } else if (xDomainMax > xAxisLimits.max) {
      newTransform.translateX = innerWidth - initialXScale(xAxisLimits.max) * newTransform.scaleX;
    }

    // Y축 경계 체크 및 최종 translate 조정
    const yDomainMin = initialYScale.invert((innerHeight - newTransform.translateY) / newTransform.scaleY);
    const yDomainMax = initialYScale.invert(-newTransform.translateY / newTransform.scaleY);

    if (yDomainMin < yAxisLimits.min) {
      newTransform.translateY = innerHeight - initialYScale(yAxisLimits.min) * newTransform.scaleY;
    } else if (yDomainMax > yAxisLimits.max) {
      newTransform.translateY = -initialYScale(yAxisLimits.max) * newTransform.scaleY;
    }

    return newTransform;
  };

  return {
    xAxisLimits,
    yAxisLimits,
    constrainTransform,
  };
}; 