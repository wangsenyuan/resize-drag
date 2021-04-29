import React, { useEffect, useReducer, useState } from "react";
import FullDiv from "@/components/full-div";
import styled from "styled-components";
import { CONTROLE_TYPES } from "@app/state";
import { binarySearch, getViewRect } from "@/utils";
import { useViewBox } from "../editor-context";
import Control from "./preview-controls";
import { useGetWorkspace } from "../workspace/workspace-context";
import useEfficientDragLayer from "@app/dnd/efficient-drag-layer";

const PageDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function createControl({ item, offset, getWorkspaceOffset, heights }) {
  let { x, y } = offset;
  let { y: ny } = getWorkspaceOffset(x, y);

  let j = binarySearch(heights.length, (j) => heights[j] > ny);

  let res = {};
  if (item.type === CONTROLE_TYPES.LABEL) {
    // just return a label control
    res = {
      defKey: item.defKey,
      type: CONTROLE_TYPES.LABEL,
      top: ny,
      left: x,
      properties: {
        x1: 1,
        y1: j,
        x2: 1,
        y2: j,
        backgroundColor: "black",
      },
    };
  }
  console.log(`control ${JSON.stringify(res)} created`);
  return res;
}

function wrapOffset(control, offset, widths, heights) {
  if (Array.isArray(control)) {
    return control.map((item) => wrapOffset(item, offset, widths, heights));
  }

  let box = getViewRect(
    widths,
    heights,
    control.properties.x1,
    control.properties.y1,
    control.properties.x2,
    control.properties.y2
  );

  console.log(`>>>  properties ${JSON.stringify(control.properties)}`);
  console.log(
    `>>>> box ${JSON.stringify(box)} offset = ${JSON.stringify(offset)}`
  );
  let { offsetX, offsetY } = box;

  let { dx, dy } = offset;

  let x1 = binarySearch(widths.length, (i) => widths[i] > offsetX + dx) - 1;
  if (x1 < 1) {
    x1 = 1;
  }

  let y1 = binarySearch(heights.length, (i) => heights[i] > offsetY + dy) - 1;

  if (y1 < 1) {
    y1 = 1;
  }

  let x2 = x1 + control.properties.x2 - control.properties.x1;
  let y2 = y1 + control.properties.y2 - control.properties.y1;

  control = Object.assign({}, control, {
    properties: Object.assign({}, control.properties, { x1, y1, x2, y2 }),
  });

  console.log(`<<< properties ${JSON.stringify(control.properties)}`);

  return control;
}

function Preview({ item, currentOffset }) {
  const workspace = useGetWorkspace();

  if (currentOffset.x < workspace.offset.left) {
    return null;
  }

  return <Preview2 item={item} currentOffset={currentOffset} />;
}

function stateReducer(state, { x, y, widths, heights }) {
  console.log(`state reducer ${x} ${y}`);
  let dx = x - state.left;
  let dy = y - state.top;
  return wrapOffset(state, { dx, dy }, widths, heights);
}

function Preview2({ item, currentOffset }) {
  const viewBox = useViewBox();
  const workspace = useGetWorkspace();
  const [control, dispatch] = useReducer(
    stateReducer,
    {
      item,
      offset: currentOffset,
      heights: viewBox.heights,
      getWorkspaceOffset: workspace.getWorkspaceOffset,
    },
    createControl
  );

  useEffect(() => {
    requestAnimationFrame(() =>
      dispatch({
        x: currentOffset.x,
        y: currentOffset.y,
        widths: viewBox.widths,
        heights: viewBox.heights,
      })
    );
  }, [currentOffset, viewBox, dispatch]);

  return <Control control={control} />;
}

function PreviewLayer() {
  const { isDragging, item, currentOffset } = useEfficientDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging || !item || !currentOffset) {
    return null;
  }

  return (
    <PageDiv className="drag-preview-layer">
      <FullDiv>
        <Preview item={item} currentOffset={currentOffset}></Preview>
      </FullDiv>
    </PageDiv>
  );
}

export default PreviewLayer;
