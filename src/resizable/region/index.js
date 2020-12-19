import React from "react";
import { px } from "../utils";
import "./index.scss";

const Region = ({ rect, children }) => {
  const { top, left, width, height } = rect;

  return (
    <div
      className={"region-wrapper"}
      style={{
        top: px(top),
        left: px(left),
        width: px(width),
        height: px(height),
        position: "absolute",
      }}
    >
      {children}
    </div>
  );
};

export default Region;
