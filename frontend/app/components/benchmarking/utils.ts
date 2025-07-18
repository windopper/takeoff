import { scaleLinear, scaleTime } from "@visx/scale";
import { ScatterPlotData, AxisLimits, Margin, BoxPlotData } from "./types";


export const DEFAULT_COLOR = "rgba(100, 200, 200, 0.8)"; // 소프트 네온 시안

const colors = [
  "rgba(255, 100, 120, 0.8)", // 소프트 네온 레드
  "rgba(255, 160, 80, 0.8)",  // 소프트 네온 오렌지
  "rgba(255, 255, 120, 0.8)", // 소프트 네온 옐로우
  "rgba(120, 255, 100, 0.8)", // 소프트 네온 그린
  "rgba(100, 200, 255, 0.8)", // 소프트 네온 시안
  "rgba(120, 150, 255, 0.8)", // 소프트 네온 블루
  "rgba(200, 120, 255, 0.8)", // 소프트 네온 바이올렛
  "rgba(255, 120, 255, 0.8)", // 소프트 네온 마젠타
  "rgba(255, 120, 180, 0.8)", // 소프트 네온 핑크
  "rgba(200, 255, 100, 0.8)", // 소프트 네온 라임
  "rgba(180, 180, 180, 0.8)", // 소프트 네온 실버
]

export const getOrganizationColors = (organization: string) => {
  switch (organization) {
    case "OpenAI":
      return colors[0];
    case "Anthropic":
      return colors[1];
    case "Google DeepMind":
    case "Google AI":
    case "Google Brain":
    case "Google Cloud":
    case "Google Research":
    case "Google":
      return colors[2];
    case "Meta AI":
    case "Facebook":
    case "Facebook AI":
    case "Facebook AI Research":
      return colors[3];
    case "Microsoft":
      return colors[4];
    case "xAI":
      return colors[5];
    case "DeepSeek":
      return colors[6];
    case "Alibaba":
      return colors[7];
    case "Mistral AI":
      return colors[8];
    default:
      return colors[9];
  }
};

export const getCountryColors = (country: string) => {
  switch (country) {
    case "Multinational":
      return colors[0];
    case "United States of America":
      return colors[1];
    case "Canada":
      return colors[2];
    case "United Kingdom":
      return colors[3];
    case "France":
      return colors[4];
    case "China":
      return colors[5];
    case "India":
      return colors[6];
    case "Japan":
      return colors[7];
    case "Belgium":
      return colors[8];
    case "Korea (Republic of)":
      return colors[9];
    default:
      return colors[10];
  }
}

const Y_PADDING_RATIO = 0.1;
const X_PADDING_RATIO = 0.2;

export const calculateDateExtent = (data: ScatterPlotData[]): [number, number] => {
  return [
    Math.min(...data.map((d) => d.x.getTime() - 1000 * 60 * 60 * 24 * 30)),
    Math.max(...data.map((d) => d.x.getTime() + 1000 * 60 * 60 * 24 * 30)),
  ];
};

export const calculateYExtent = (data: ScatterPlotData[]): [number, number] => {
  if (data.length === 0) return [0, 100];
  const minValue = Math.min(...data.map((d) => d.y));
  const maxValue = Math.max(...data.map((d) => d.y));
  const padding = (maxValue - minValue) * Y_PADDING_RATIO;
  return [minValue - padding, maxValue + padding];
};

export const calculateBoxPlotYExtent = (data: BoxPlotData[]): [number, number] => {
  if (data.length === 0) return [0, 100];
  
  // stderr를 고려하여 최소/최대값 계산
  const allValues: number[] = [];
  data.forEach(d => {
    allValues.push(d.y + d.stderr);
    allValues.push(d.y - d.stderr);
  });
  
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * Y_PADDING_RATIO;
  
  return [minValue - padding, maxValue + padding];
};

export const createInitialXScale = (data: ScatterPlotData[], innerWidth: number) => {
  const dateExtent = calculateDateExtent(data);
  return scaleTime({
    domain: dateExtent,
    range: [0, innerWidth],
  });
};

export const createInitialYScale = (data: ScatterPlotData[], innerHeight: number) => {
  const yExtent = calculateYExtent(data);
  return scaleLinear({
    domain: yExtent,
    range: [innerHeight, 0],
  });
};

export const createBoxPlotInitialXScale = (data: BoxPlotData[], innerWidth: number) => {
  const dateExtent = calculateBoxPlotDateExtent(data);
  return scaleTime({
    domain: dateExtent,
    range: [0, innerWidth],
  });
};

export const createBoxPlotInitialYScale = (data: BoxPlotData[], innerHeight: number) => {
  const yExtent = calculateBoxPlotYExtent(data);
  return scaleLinear({
    domain: yExtent,
    range: [innerHeight, 0],
  });
};

export const calculateBoxPlotDateExtent = (data: BoxPlotData[]): [number, number] => {
  return [
    Math.min(...data.map((d) => d.x.getTime() - 1000 * 60 * 60 * 24 * 30)),
    Math.max(...data.map((d) => d.x.getTime() + 1000 * 60 * 60 * 24 * 30)),
  ];
};

export const calculateAxisLimits = (data: ScatterPlotData[]) => {
  const xAxisLimits: AxisLimits = (() => {
    if (data.length === 0) return { min: new Date(), max: new Date() };
    const minDate = Math.min(...data.map((d) => d.x.getTime()));
    const maxDate = Math.max(...data.map((d) => d.x.getTime()));
    const dateRange = maxDate - minDate;
    const padding = dateRange * X_PADDING_RATIO;
    
    return {
      min: new Date(minDate - padding),
      max: new Date(maxDate + padding),
    };
  })();

  const yAxisLimits: AxisLimits = (() => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = data.map((d) => d.y);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    const padding = valueRange * Y_PADDING_RATIO;
    
    return {
      min: minValue - padding,
      max: maxValue + padding,
    };
  })();

  return { xAxisLimits, yAxisLimits };
};

export const calculateTooltipPosition = (mouseX: number, mouseY: number) => {
  const tooltipWidth = 320; // w-80 = 20rem = 320px
  const tooltipHeight = 150; // 대략적인 툴팁 높이
  const offset = 15;
  const padding = 10; // 화면 가장자리에서의 여백

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = mouseX + offset;
  let top = mouseY - offset;

  // 오른쪽 경계 체크
  if (left + tooltipWidth > viewportWidth - padding) {
    left = mouseX - tooltipWidth - offset * 5; // 마우스 왼쪽에 표시
  }

  // 왼쪽 경계 체크
  if (left < padding) {
    left = padding;
  }

  // 아래쪽 경계 체크
  if (top + tooltipHeight > viewportHeight - padding) {
    top = mouseY - tooltipHeight - offset; // 마우스 위쪽에 표시
  }

  // 위쪽 경계 체크
  if (top < padding) {
    top = padding;
  }

  return { left, top };
};

export const findPointAtPosition = (
  dataPoints: Array<{ x: number; y: number; data: ScatterPlotData; radius: number }>,
  mouseX: number,
  mouseY: number
) => {
  return dataPoints.find(point => {
    const distance = Math.sqrt(
      Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
    );
    return distance <= point.radius;
  });
};

export const findBoxPlotPointAtPosition = (
  dataPoints: Array<{ x: number; y: number; data: BoxPlotData; radius: number }>,
  mouseX: number,
  mouseY: number
) => {
  return dataPoints.find(point => {
    const distance = Math.sqrt(
      Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
    );
    return distance <= point.radius;
  });
}; 