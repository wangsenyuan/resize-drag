import React from "react";
import { useViewBox, useGetAuxiliaryLine } from "../../../state";
import styled from "styled-components";

function createHorizontalLines(width) {
  return (arr, height) => {
    if (!arr || arr.length === 0) {
      return [{ x1: 0, x2: width, y1: height, y2: height }];
    }
    let prev = arr[arr.length - 1];
    return [
      ...arr,
      { x1: 0, x2: width, y1: prev.y1 + height, y2: prev.y2 + height },
    ];
  };
}

function HorizontalLines({ rows, width }) {
  let lines = rows.reduce(createHorizontalLines(width), []);

  return (
    <>
      {lines.map((cur, i) => (
        <line
          x1={`${cur.x1}`}
          x2={`${cur.x2}`}
          y1={`${cur.y1}`}
          y2={`${cur.y2}`}
          stroke="black"
          key={i}
          strokeWidth="1px"
          shapeRendering="optimizeSpeed"
        />
      ))}
    </>
  );
}

function createVerticalLines(height) {
  return (arr, width) => {
    if (!arr || arr.length === 0) {
      return [{ x1: width, x2: width, y1: 0, y2: height }];
    }
    let prev = arr[arr.length - 1];
    return [
      ...arr,
      {
        x1: width + prev.x1,
        x2: width + prev.x2,
        y1: 0,
        y2: height,
      },
    ];
  };
}

function VerticalLines({ columns, height }) {
  let lines = columns.reduce(createVerticalLines(height), []);

  return (
    <>
      {lines.map((cur, i) => (
        <line
          x1={`${cur.x1}`}
          x2={`${cur.x2}`}
          y1={`${cur.y1}`}
          y2={`${cur.y2}`}
          stroke="black"
          key={i}
          strokeWidth="1px"
          shapeRendering="optimizeSpeed"
        />
      ))}
    </>
  );
}

const PageDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

function Page() {
  const viewBox = useViewBox();

  return (
    <PageDiv className="grid">
      <svg
        width={viewBox.width}
        height={viewBox.height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      >
        <HorizontalLines rows={viewBox.rows} width={viewBox.width} />
        <VerticalLines columns={viewBox.columns} height={viewBox.height} />
      </svg>
    </PageDiv>
  );
}

export default Page;
