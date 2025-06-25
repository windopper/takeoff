import { ScatterPlotData, Margin, DataPoint, ModelLabel, BoxPlotData, BoxPlotModelLabel } from "./types";

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private margin: Margin;
  private labelColor: string;
  private postfix: string;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    margin: Margin,
    labelColor: string = "#9ca3af",
    postfix: string = "%"
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.labelColor = labelColor;
    this.postfix = postfix;
  }

  setPostfix(postfix: string) {
    this.postfix = postfix;
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";

    this.ctx.clearRect(0, 0, rect.width, rect.height);
  }

  drawGridAndAxes(xScale: any, yScale: any) {
    // 그리드 선 그리기
    this.ctx.strokeStyle = "#e0e0e0";
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = 0.5;

    // 수평 격자선 (Y축 틱에 맞춰)
    const yTicks = yScale.ticks(5);
    yTicks.forEach((value: number) => {
      const y = yScale(value) + this.margin.top;
      this.ctx.beginPath();
      this.ctx.moveTo(this.margin.left, y);
      this.ctx.lineTo(this.width - this.margin.right, y);
      this.ctx.stroke();
    });

    // 수직 격자선 (X축 틱에 맞춰)
    const xTicks = xScale.ticks(6);
    xTicks.forEach((value: Date) => {
      const x = xScale(value) + this.margin.left;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.margin.top);
      this.ctx.lineTo(x, this.height - this.margin.bottom);
      this.ctx.stroke();
    });

    this.ctx.globalAlpha = 1;

    // 축 그리기
    this.ctx.strokeStyle = this.labelColor;
    this.ctx.lineWidth = 1;

    // X축
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin.left, this.height - this.margin.bottom);
    this.ctx.lineTo(this.width - this.margin.right, this.height - this.margin.bottom);
    this.ctx.stroke();

    // Y축
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin.left, this.margin.top);
    this.ctx.lineTo(this.margin.left, this.height - this.margin.bottom);
    this.ctx.stroke();

    // 축 레이블 그리기
    this.ctx.fillStyle = this.labelColor;
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";

    // X축 레이블
    xTicks.forEach((value: Date) => {
      const x = xScale(value) + this.margin.left;
      const label = `${value.toLocaleString("en", { month: "short" })} ${value.getFullYear()}`;
      this.ctx.fillText(label, x, this.height - this.margin.bottom + 20);
    });

    // Y축 레이블
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    yTicks.forEach((value: number) => {
      const y = yScale(value) + this.margin.top;
      const label = `${Math.round(value)}${this.postfix}`;
      this.ctx.fillText(label, this.margin.left - 10, y);
    });

    this.ctx.textBaseline = "alphabetic";
  }

  setupClipping() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(this.margin.left, this.margin.top, 
                  this.width - this.margin.left - this.margin.right, 
                  this.height - this.margin.top - this.margin.bottom);
    this.ctx.clip();
  }

  restoreContext() {
    this.ctx.restore();
  }

  drawDataPoint(
    point: ScatterPlotData,
    x: number,
    y: number,
    radius: number,
    isHovered: boolean,
    shouldDimOthers: boolean
  ) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (shouldDimOthers) {
      this.ctx.fillStyle = "#9ca3af";
      this.ctx.globalAlpha = 0.3;
    } else {
      this.ctx.fillStyle = point.color;
      this.ctx.globalAlpha = isHovered ? 1 : 0.7;
    }
    
    this.ctx.fill();
    
    if (shouldDimOthers) {
      this.ctx.strokeStyle = "#9ca3af";
    } else {
      this.ctx.strokeStyle = point.color;
    }
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = isHovered ? 2 : 1;
    this.ctx.stroke();
  }

  drawBoxPlot(
    point: BoxPlotData,
    x: number,
    y: number,
    yScale: any,
    isHovered: boolean,
    shouldDimOthers: boolean
  ) {
    // stderr를 기반으로 위아래 위치 계산
    const upperValue = point.y + point.stderr;
    const lowerValue = point.y - point.stderr;
    const upperY = yScale(upperValue) + this.margin.top;
    const lowerY = yScale(lowerValue) + this.margin.top;
    
    // 색상과 투명도 설정
    if (shouldDimOthers) {
      this.ctx.strokeStyle = "#9ca3af";
      this.ctx.globalAlpha = 0.3;
    } else {
      this.ctx.strokeStyle = point.color;
      this.ctx.globalAlpha = isHovered ? 1 : 0.7;
    }
    
    this.ctx.lineWidth = isHovered ? 2 : 1.5;
    
    // 세로선으로 위스커 연결 (상단 끝 -> 하단 끝)
    this.ctx.beginPath();
    this.ctx.moveTo(x, upperY - 5);
    this.ctx.lineTo(x, lowerY + 5);
    this.ctx.stroke();
    
    // 위스커 끝부분 가로선
    // 상단 가로선
    this.ctx.beginPath();
    this.ctx.moveTo(x - 4, upperY - 5);
    this.ctx.lineTo(x + 4, upperY - 5);
    this.ctx.stroke();
    
    // 하단 가로선
    this.ctx.beginPath();
    this.ctx.moveTo(x - 4, lowerY + 5);
    this.ctx.lineTo(x + 4, lowerY + 5);
    this.ctx.stroke();
    
    // 중앙점 표시 (평균값)
    this.ctx.beginPath();
    this.ctx.arc(x, y + this.margin.top, 3, 0, 2 * Math.PI);
    if (shouldDimOthers) {
      this.ctx.fillStyle = "#9ca3af";
    } else {
      this.ctx.fillStyle = point.color;
    }
    this.ctx.fill();
    
    this.ctx.globalAlpha = 1;
  }

  drawModelLabels(modelLabels: Map<string, ModelLabel>, hoveredPoint: ScatterPlotData | null, pinnedPoint: ScatterPlotData | null) {
    this.ctx.font = "12px PyeojinGothic-Bold";
    this.ctx.textAlign = "right";
    
    modelLabels.forEach(({ x, y, color, data: labelData, label }) => {
      if (x >= this.margin.left && x <= this.width - this.margin.right && 
          y >= this.margin.top && y <= this.height - this.margin.bottom) {
        const isHovered = (hoveredPoint && hoveredPoint.id === labelData.id) ||
                         (pinnedPoint && pinnedPoint.id === labelData.id);
        const shouldDimOthers = (hoveredPoint || pinnedPoint) && !isHovered;
        
        if (shouldDimOthers) {
          this.ctx.fillStyle = "#9ca3af";
          this.ctx.globalAlpha = 0.5;
        } else {
          this.ctx.fillStyle = color;
          this.ctx.globalAlpha = 1;
        }
        
        this.ctx.fillText(label, x - 10, y - 10);
        this.ctx.globalAlpha = 1;
      }
    });
  }

  drawBoxPlotModelLabels(modelLabels: Map<string, BoxPlotModelLabel>, hoveredPoint: BoxPlotData | null, pinnedPoint: BoxPlotData | null) {
    this.ctx.font = "12px PyeojinGothic-Bold";
    this.ctx.textAlign = "right";
    
    modelLabels.forEach(({ x, y, color, data: labelData, label }) => {
      if (x >= this.margin.left && x <= this.width - this.margin.right && 
          y >= this.margin.top && y <= this.height - this.margin.bottom) {
        const isHovered = (hoveredPoint && hoveredPoint.id === labelData.id) ||
                         (pinnedPoint && pinnedPoint.id === labelData.id);
        const shouldDimOthers = (hoveredPoint || pinnedPoint) && !isHovered;
        
        if (shouldDimOthers) {
          this.ctx.fillStyle = "#9ca3af";
          this.ctx.globalAlpha = 0.5;
        } else {
          this.ctx.fillStyle = color;
          this.ctx.globalAlpha = 1;
        }
        
        this.ctx.fillText(label, x - 10, y - 10);
        this.ctx.globalAlpha = 1;
      }
    });
  }

  isPointInViewport(x: number, y: number): boolean {
    return (
      x >= this.margin.left - 10 &&
      x <= this.width - this.margin.right + 10 &&
      y >= this.margin.top - 10 &&
      y <= this.height - this.margin.bottom + 10
    );
  }
} 