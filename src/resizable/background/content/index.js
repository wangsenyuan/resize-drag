import React from "react";
import { px } from "../../utils";
import "./index.scss";
import { useClipContext, useSvgMoving, useViewBox } from "../../context";

const drawRowLines = (rows, width) => {
  let lines = [];
  let height = 0;
  for (let i = 0; i < rows.length; i++) {
    let cur = rows[i];
    height += cur.height;
    lines.push(
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke="black"
        key={i}
        strokeWidth="1px"
        shapeRendering="optimizeSpeed"
      />
    );
  }
  return lines;
};

const drawColLines = (cols, height) => {
  let lines = [];
  let width = 0;
  for (let i = 0; i < cols.length; i++) {
    let cur = cols[i];
    width += cur.width;
    lines.push(
      <line
        x1={width}
        y1={0}
        x2={width}
        y2={height}
        stroke="black"
        key={i}
        strokeWidth="1px"
        shapeRendering="optimizeSpeed"
      />
    );
  }
  return lines;
};

const drawMovingLine = (move, viewBox) => {
  if (!move) {
    return null;
  }
  let { width, height, offsetX, offsetY } = viewBox;
  let { dir, x, y } = move;
  x -= offsetX;
  y -= offsetY;

  if (dir === "vertical") {
    return (
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1"
      />
    );
  }
  return (
    <line
      x1={0}
      y1={y}
      x2={width}
      y2={y}
      stroke="black"
      strokeWidth="1"
      strokeLinecap="round"
      strokeDasharray="1"
    />
  );
};

const drawRect = ({ x1, y1, x2, y2 }, viewBox, fill) => {
  // console.log(`draw ${x1} ${y1} ${x2} ${y2}`);

  x1 -= viewBox.offsetX;
  x2 -= viewBox.offsetX;
  y1 -= viewBox.offsetY;
  y2 -= viewBox.offsetY;

  return (
    <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={fill}></rect>
  );
};

const drawVirtualRect = (virtualRect, viewBox) => {
  if (!virtualRect) {
    return;
  }
  return drawRect(virtualRect, viewBox, "gray");
};

const drawClipRegion = (region, viewBox) => {
  if (!region) {
    return null;
  }
  return drawRect(region, viewBox, "green");
};

const Page = ({ rows, columns }) => {
  const { currentMove } = useSvgMoving();
  const { viewBox } = useViewBox();
  const { virtualRect, clipRegion } = useClipContext();
  return (
    <div
      className="background-svg-container"
      style={{ width: px(viewBox.width), height: px(viewBox.height) }}
    >
      <svg
        width={viewBox.width}
        height={viewBox.height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      >
        {drawRowLines(rows, viewBox.width)}
        {drawColLines(columns, viewBox.height)}
        {drawMovingLine(currentMove, viewBox)}
        {drawVirtualRect(virtualRect, viewBox)}
        {drawClipRegion(clipRegion, viewBox)}
      </svg>
    </div>
  );
};

export default Page;
