import React, { useMemo, useState } from "react";

import ResizableGrid from "@/resizable";

const initLayout = {
  first: { top: 0, left: 0, width: 200, height: 150 },
  second: { top: 300, left: 500, width: 200, height: 150 },
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
  return (
    <ResizableGrid
      layouts={layout}
      rows={rows}
      onChangeRows={setRows}
      cols={cols}
      onChangeCols={setCols}
      onLayoutChange={setLayout}
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
