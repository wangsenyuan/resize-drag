import React, { useCallback, useMemo, useState } from "react";

import ResizableGrid from "@/resizable";

const initLayout = {
  first: { rect: { r1: 0, c1: 0, r2: 2, c2: 2 } },
  second: { rect: { r1: 3, c1: 3, r2: 10, c2: 5 } },
};

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

const Page = () => {
  const [layout, setLayout] = useState(initLayout);
  const [rows, setRows] = useState(initRows(30));
  const [cols, setCols] = useState(initCols(20));

  const onChangeLayout = useCallback(
    (key, layout) => {
      setLayout((layouts) => {
        let cur = layouts[key];
        let tmp = Object.assign({}, cur, { rect: layout });
        let newLayouts = Object.assign({}, layouts);
        newLayouts[key] = tmp;
        return newLayouts;
      });
    },
    [setLayout]
  );
  return (
    <ResizableGrid
      layouts={layout}
      rows={rows}
      onChangeRows={setRows}
      cols={cols}
      onChangeCols={setCols}
      onChangeLayout={onChangeLayout}
      style={{ width: "800px", height: "600px", position: "relative" }}
    >
      <div className="demo-element" key="first">
        Hello ResizableGrid
      </div>
      <div className="demo-element" key="second">
        Hello World
      </div>
    </ResizableGrid>
  );
};

export default Page;
