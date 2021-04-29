import React, { useEffect, useMemo, useReducer, useState } from "react";
import FullDiv from "@/components/full-div";
import styled from "styled-components";
import { binarySearch, getViewRect, px } from "@/utils";
import { useDragLayer } from "react-dnd";
import { useViewBox, useWorkspace } from "@app/editor/editor-context";

const PageDiv = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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

  const rect = useMemo(() => {
    let { x, y } = current;
    x -= workspace.offset.left;
    y -= workspace.offset.top;
    current = { x, y };
    // console.log(`current position is ${JSON.stringify(current)}`);
    let control = createControl(item, current, viewBox);
    // console.log(`control ${JSON.stringify(control)}`);
    let rect = findRect(control.properties, viewBox);
    // console.log(`get rect ${JSON.stringify(rect)}`);
    return rect;
  }, [item, current, viewBox]);

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "red",
        top: px(rect.offsetY),
        left: px(rect.offsetX),
        width: px(rect.width),
        height: px(rect.height),
      }}
    >
      移动
    </div>
  );
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
  return Object.assign({}, item, {
    properties: { x1: i, y1: j, x2: i + 1, y2: j },
  });
}

function findRect(properties, viewBox) {
  let { x1, y1, x2, y2 } = properties;
  return getViewRect(viewBox.widths, viewBox.heights, x1, y1, x2, y2);
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
