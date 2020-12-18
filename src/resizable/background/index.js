import React, { useMemo, useState } from "react";
import "./index.scss";
import { px, last } from "../utils";
import Rows from "./rows";
import Columns from "./columns";
import Content from "./content";
import { SvgMovingContext } from "../context";

const partialSum = (initValue, nums) => {
  let res = [initValue, ...nums];
  for (let i = 1; i < res.length; i++) {
    res[i] += res[i - 1];
  }
  return res;
};

const initWidth = 50;
const initHeight = 50;

const initMovingState = { dir: "vertical", x: 0, y: 0 };

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

  const [moving, setMoving] = useState(initMovingState);

  return (
    <div
      className="resizable-grid-background"
      style={{
        position: "absolute",
        width: px(last(prefColWidths) + initWidth),
        height: px(last(prefRowHeights) + initHeight),
      }}
    >
      <SvgMovingContext.Provider
        value={{ currentMove: moving, onCurrentMove: setMoving }}
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

          <Content
            rows={rows}
            cols={cols}
            width={last(prefColWidths)}
            height={last(prefRowHeights)}
            top={initHeight}
            left={initWidth}
          />
        </div>
      </SvgMovingContext.Provider>
    </div>
  );
};

export default Page;
