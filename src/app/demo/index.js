import React, { useReducer, useCallback } from "react";

import ResizableGrid from "@/resizable";
import { createAction } from "../../resizable/utils";
const initRows = (count) => {
  let height = 50;
  let res = [];
  for (let i = 0; i < count; i++) {
    res.push({ height });
  }
  return res;
};

const initCols = (count) => {
  let width = 100;
  let res = [];
  for (let i = 0; i < count; i++) {
    res.push({ width });
  }
  return res;
};

const initLayout = {
  rows: initRows(30),
  columns: initCols(26),
  regions: [
    { key: "first", r1: 1, c1: 1, r2: 4, c2: 2 },
    { key: "second", r1: 4, c1: 4, r2: 4, c2: 6 },
    { key: "third", r1: 2, c1: 4, r2: 2, c2: 7 },
  ],
  children: [],
};

const updateRegion = (state, { key, fieldKey, fieldValue }) => {
  let { regions } = state;
  let newRegions = regions.map((cur) => {
    if (cur.key === key) {
      let newObj = Object.assign({}, cur);
      newObj[fieldKey] = fieldValue;
      return newObj;
    }
    return cur;
  });
  return Object.assign({}, state, { regions: newRegions });
};

const updateRow = (state, { index, height }) => {
  let { rows } = state;
  let newRows = rows.slice();
  newRows[index] = Object.assign({}, newRows[index], { height });
  return Object.assign({}, state, { rows: newRows });
};

const updateColumn = (state, { index, width }) => {
  let { columns } = state;
  let newColumnes = columns.slice();
  newColumnes[index] = Object.assign({}, newColumnes[index], { width });
  return Object.assign({}, state, { columns: newColumnes });
};

const addText = (state, { r1, c1, r2, c2 }) => {
  let { children, regions } = state;
  let id = children.length;
  let key = "child-" + id;
  let region = { key, r1, c1, r2, c2 };
  let newRegions = [...regions, region];
  let newChildren = [...children, { type: "input", key }];
  return Object.assign({}, state, {
    children: newChildren,
    regions: newRegions,
  });
};

const layoutReducer = (state, { type, value }) => {
  switch (type) {
    case "change-row":
      return updateRow(state, value);
    case "change-column":
      return updateColumn(state, value);
    case "change-region":
      return updateRegion(state, value);
    case "add-text":
      return addText(state, value);
  }
  return state;
};

const renderChild = (child) => {
  if (child.type === "input") {
    return <input key={child.key} placeholder="test" />;
  }
  return null;
};

const renderLayoutChildren = (layout) => {
  let { children } = layout;

  let res = [...children.map((child) => renderChild(child))];
  res.push(
    <div className="demo-element" key="first">
      Hello ResizableGrid
    </div>
  );
  res.push(
    <div className="demo-element" key="second">
      Hello World
    </div>
  );

  res.push(
    <div className="demo-element" key="third">
      Hello Again
    </div>
  );

  return res;
};

const Page = () => {
  const [layout, dispatch] = useReducer(layoutReducer, initLayout);

  const onAddText = useCallback(
    (evt, region) => {
      console.log("onAddText called (" + JSON.stringify(region) + ")");
      dispatch(createAction("add-text", region));
    },
    [dispatch]
  );

  return (
    <>
      <div>这是操作区域上面</div>
      <ResizableGrid
        layout={layout}
        onChangeLayout={dispatch}
        onClickEmptyRegion={onAddText}
      >
        {renderLayoutChildren(layout)}
      </ResizableGrid>
      <div>这在操作区域下面</div>
    </>
  );
};

export default Page;
