import React, { useReducer } from "react";

import ResizableGrid from "@/resizable";
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
};

const updateRegion = (state, { key, region }) => {
  let { regions } = state;
  let newRegions = regions.map((cur) => {
    if (cur.key === key) {
      return Object.assign({}, cur, { ...region });
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

const layoutReducer = (state, { type, value }) => {
  switch (type) {
    case "change-row":
      return updateRow(state, value);
    case "change-column":
      return updateColumn(state, value);
    case "change-region":
      return updateRegion(state, value);
  }
  return state;
};

const Page = () => {
  const [layout, dispatch] = useReducer(layoutReducer, initLayout);

  return (
    <>
      <div>这是操作区域上面</div>
      <ResizableGrid layout={layout} onChangeLayout={dispatch}>
        <div className="demo-element" key="first">
          Hello ResizableGrid
        </div>
        <div className="demo-element" key="second">
          Hello World
        </div>
        <div className="demo-element" key="third">
          Hello Again
        </div>
      </ResizableGrid>
      <div>这在操作区域下面</div>
    </>
  );
};

export default Page;
