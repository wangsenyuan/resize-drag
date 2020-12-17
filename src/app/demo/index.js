import React, { useState } from "react";

import ResizableGrid from "@/resizable";

const initLayout = {
  first: { top: 0, left: 0, width: 200, height: 150 },
  second: { top: 300, left: 500, width: 200, height: 150 },
};

const Page = () => {
  const [layout, setLayout] = useState(initLayout);

  return (
    <ResizableGrid
      layouts={layout}
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
