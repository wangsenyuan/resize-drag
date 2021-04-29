import React, { useMemo, useContext } from "react";
import { useViewBox } from "../editor-context";
import { getViewRect, px } from "@/utils";

export function useRectProperties(properties, parentOffset) {
  const viewBox = useViewBox();

  let res = useMemo(() => {
    let { x1, y1, x2, y2 } = properties;
    let { offsetX, offsetY, width, height } = getViewRect(
      viewBox.widths,
      viewBox.heights,
      x1,
      y1,
      x2,
      y2
    );
    let top = offsetY;
    let left = offsetX;
    if (parentOffset) {
      top -= parentOffset.offsetY;
      left -= parentOffset.offsetX;
    }
    let res = {
      top: px(top),
      left: px(left),
      width: px(width),
      height: px(height),
      offsetX,
      offsetY,
    };

    return res;
  }, [viewBox, properties, parentOffset]);

  let style = {
    position: "absolute",
    ...res,
    opacity: 0.8,
    backgroundColor: properties.backgroundColor ?? "white",
  };

  return style;
}
