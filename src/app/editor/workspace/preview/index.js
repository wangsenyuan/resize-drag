import React, { useEffect, useMemo, useReducer, useState } from "react";
import FullDiv from "@/components/full-div";
import styled from "styled-components";
import { binarySearch, px } from "@/utils";
import { useDragLayer } from "react-dnd";
import { useViewBox, useWorkspace } from "@app/editor/editor-context";
import Control from "./preview-controls";

const PageDiv = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  cursor: grabbing;
`;

function Preview1({ item, current }) {
  const workspace = useWorkspace();
  if (!item || !current || !workspace.withIn(current.x, current.y)) {
    return null;
  }
  // console.log(`preview1 current is ${JSON.stringify(current)}`);
  return <Preview2 item={item} current={current} />;
}

function Preview2({ item, current }) {
  const viewBox = useViewBox();
  const workspace = useWorkspace();

  const control = useMemo(() => {
    let { x, y } = workspace.getWorkspaceCoords(current.x, current.y);
    x -= workspace.offset.left;
    y -= workspace.offset.top;
    current = { x, y };
    // console.log(`current position is ${JSON.stringify(current)}`);
    // console.log(`${JSON.stringify(item)}`);
    let control = createControl(item, current, viewBox);
    // console.log(`control ${JSON.stringify(control)}`);
    return control;
  }, [item, current, viewBox]);

  return <Control control={control} />;
}

function floorValue(arr, v) {
  let i = binarySearch(arr.length, (i) => arr[i] >= v);
  return arr[i];
}

function createControl(item, current, viewBox) {
  let { x, y } = current;
  x = floorValue(viewBox.widths, x);
  y = floorValue(viewBox.heights, y);
  let i = binarySearch(viewBox.widths.length, (i) => viewBox.widths[i] >= x);
  let j = binarySearch(viewBox.heights.length, (j) => viewBox.heights[j] >= y);
  let { properties } = item;
  let { x1, y1 } = properties;
  let dx = i - x1;
  let dy = j - y1;

  return applyOffset(item, dx, dy);
}

function applyOffset(item, dx, dy) {
  let { children, properties } = item;
  let { x1, y1, x2, y2 } = properties;
  x1 += dx;
  y1 += dy;
  x2 += dx;
  y2 += dy;

  children = children?.map((child) => applyOffset(child, dx, dy));

  properties = Object.assign({}, properties, { x1, y1, x2, y2 });

  return Object.assign({}, item, { children, properties });
}

function PreviewLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <PageDiv className="drag-preview-layer" style={{ pointerEvents: "none" }}>
      <FullDiv>
        <Preview1 item={item} current={currentOffset} />
      </FullDiv>
    </PageDiv>
  );
}

export default PreviewLayer;
