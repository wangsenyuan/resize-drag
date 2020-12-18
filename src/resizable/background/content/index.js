import React from "react";
import { px } from "../../utils";
import "./index.scss";
import { useSvgMoving } from "../../context";

const drawRowLines = (rows, width) => {
  let lines = [];
  let height = 0;
  for (let i = 0; i < rows.length; i++) {
    let cur = rows[i];
    height += cur.height;
    lines.push(
      <line x1={0} y1={height} x2={width} y2={height} stroke="black" key={i} />
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
      <line x1={width} y1={0} x2={width} y2={height} stroke="black" key={i} />
    );
  }
  return lines;
};

const drawMovingLine = (move, width, height, top, left) => {
  if (!move) {
    return null;
  }
  let { dir, x, y } = move;
  x -= left;
  y -= top;

  let line = null;

  if (dir === "vertical") {
    line = (
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="black"
        stroke-linecap="round"
        stroke-dasharray="1"
      />
    );
  } else {
    line = (
      <line
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="black"
        stroke-linecap="round"
        stroke-dasharray="1"
      />
    );
  }

  return line;
};

const Page = ({ rows, cols, width, height, top, left }) => {
  const { currentMove } = useSvgMoving();

  return (
    <div
      className="background-svg-container"
      style={{
        position: "absolute",
        top: px(top),
        left: px(left),
        width: px(width),
        height: px(height),
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {drawRowLines(rows, width)}
        {drawColLines(cols, height)}
        {drawMovingLine(currentMove, width, height, top, left)}
      </svg>
    </div>
  );
};

export default Page;
