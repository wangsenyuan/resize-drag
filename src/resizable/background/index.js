import React, { useMemo } from "react";
import "./index.scss";
import { px, last } from "../utils";
import Rows from "./rows";
import Columns from "./columns";

const partialSum = (initValue, nums) => {
  let res = [initValue, ...nums];
  for (let i = 1; i < res.length; i++) {
    res[i] += res[i - 1];
  }
  return res;
};

const initWidth = 50;
const initHeight = 50;

// rows has height, cols has width
const Page = ({ rows, cols }) => {
  const prefRowHeights = useMemo(
    () =>
      partialSum(
        0,
        rows.map((row) => row.height)
      ),
    [rows]
  );

  const prefColWidths = useMemo(
    () =>
      partialSum(
        0,
        cols.map((col) => col.width)
      ),
    [cols]
  );

  return (
    <div
      className="resizable-grid-background"
      style={{
        position: "absolute",
        width: px(last(prefColWidths) + initWidth),
        height: px(last(prefRowHeights) + initHeight),
      }}
    >
      <div
        className="background"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <div
          className="top-left-corner grid-cell"
          style={{ width: px(initWidth), height: px(initHeight) }}
        ></div>
        <Columns
          left={initWidth}
          width={last(prefColWidths)}
          height={initHeight}
          columns={cols}
        />
        <Rows width={initWidth} rows={rows} height={last(prefRowHeights)} />
      </div>
    </div>
  );
};

export default Page;
