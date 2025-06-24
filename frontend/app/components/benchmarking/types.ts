export interface ScatterPlotData {
  id: string;
  x: Date;
  y: number;
  label: string;
  color: string;
  extra?: any;
}

export interface ScatterPlotProps {
  width?: number;
  height?: number;
  data: ScatterPlotData[];
  yAxisPostfix?: string;
}

export interface BoxPlotData {
  id: string;
  x: Date;
  y: number;
  stderr: number;
  label: string;
  color: string;
}

export interface BoxPlotProps {
  width?: number;
  height?: number;
  data: BoxPlotData[];
  extra?: any;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DataPoint {
  x: number;
  y: number;
  data: ScatterPlotData;
  radius: number;
}

export interface BoxPlotDataPoint {
  x: number;
  y: number;
  data: BoxPlotData;
  radius: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface AxisLimits {
  min: Date | number;
  max: Date | number;
}

export interface ModelLabel {
  x: number;
  y: number;
  color: string;
  data: ScatterPlotData;
  label: string;
}

export interface BoxPlotModelLabel {
  x: number;
  y: number;
  color: string;
  data: BoxPlotData;
  label: string;
} 