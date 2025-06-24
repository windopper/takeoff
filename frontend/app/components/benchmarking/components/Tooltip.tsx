import React from "react";
import { ScatterPlotData, Position, BoxPlotData } from "../types";
import { calculateTooltipPosition } from "../utils";

interface TooltipProps {
  point: ScatterPlotData;
  position: Position;
  onTooltipClick: (event: React.MouseEvent) => void;
}

interface BoxPlotTooltipProps {
  point: BoxPlotData;
  position: Position;
  onTooltipClick: (event: React.MouseEvent) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({
  point,
  position,
  onTooltipClick,
}) => {
  const tooltipPosition = calculateTooltipPosition(position.x, position.y);

  return (
    <div
      className="fixed z-50 rounded-lg border border-zinc-700 shadow-xl
       font-sans text-sm tooltip-container overflow-hidden"
      style={tooltipPosition}
      onClick={onTooltipClick}
    >
      <div className="flex flex-col w-96  backdrop-blur-sm ">
        {point.extra &&
          Object.keys(point.extra).length > 0 &&
          Object.entries(point.extra).map(([key, value], index) => (
            <div
              className={`flex flex-row gap-2 px-4 py-2 ${
                index % 2 === 0 ? `${index === 0 ? "bg-zinc-600/20" : "bg-zinc-800/20"}` : "bg-zinc-900/20"
              }`}
            >
              <span className="text-zinc-400 font-semibold text-nowrap w-48 flex items-center">
                {key}
              </span>
              <span className="w-full text-zinc-300 text-wrap">
                {(value as React.ReactNode) || (
                  <span className="text-zinc-400 font-semibold">--</span>
                )}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export const BoxPlotTooltip: React.FC<BoxPlotTooltipProps> = ({
  point,
  position,
  onTooltipClick,
}) => {
  const tooltipPosition = calculateTooltipPosition(position.x, position.y);

  return (
    <div
      className="fixed z-50 bg-zinc-900 text-zinc-100 px-2 py-3 rounded-lg border border-zinc-700 shadow-xl min-w-40 font-sans text-sm tooltip-container"
      style={tooltipPosition}
      onClick={onTooltipClick}
    >
      <div className="font-semibold mb-2 text-zinc-50 text-base w-full flex items-center justify-center">
        {point.label}
      </div>

      <div className="flex flex-row w-80 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-zinc-400 font-semibold">Score</span>
          <span className="text-zinc-400 font-semibold">Std Error</span>
          <span className="text-zinc-400 font-semibold">Upper Bound</span>
          <span className="text-zinc-400 font-semibold">Lower Bound</span>
          <span className="text-zinc-400 font-semibold">Date</span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <span className="w-full text-zinc-300 text-wrap">
            {point.y.toFixed(2)}%
          </span>
          <span className="w-full text-zinc-300 text-wrap">
            ±{point.stderr.toFixed(2)}%
          </span>
          <span className="w-full text-zinc-300 text-wrap">
            {(point.y + point.stderr).toFixed(2)}%
          </span>
          <span className="w-full text-zinc-300 text-wrap">
            {(point.y - point.stderr).toFixed(2)}%
          </span>
          <span className="w-full text-zinc-300 text-wrap">
            {point.x.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
