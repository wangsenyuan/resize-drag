import React, { useMemo } from "react";
import { useViewBox } from "../../../editor-context";
import { getViewRect, px } from "@/utils";
import { CONTROLE_TYPES } from "../../../../state";

function useRectProperties(properties, parentOffset) {
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

function Container({ control, parentOffset }) {
  let { children, properties } = control;
  const style = useRectProperties(properties, parentOffset);
  return (
    <div style={style}>
      {children?.map((child) => (
        <Control
          key={child.defKey}
          control={child}
          parentOffset={{
            offsetX: style.offsetX,
            offsetY: style.offsetY,
          }}
        />
      ))}
    </div>
  );
}

function LableControl({ control, parentOffset }) {
  let { properties, label } = control;
  const style = useRectProperties(properties, parentOffset);
  return <div style={style}>{label}</div>;
}

function Control({ control, parentOffset }) {
  if (control.type === CONTROLE_TYPES.CONTAINER) {
    return <Container control={control} parentOffset={parentOffset} />;
  }

  if (control.type === CONTROLE_TYPES.LABEL) {
    return <LableControl control={control} parentOffset={parentOffset} />;
  }

  return null;
}

export default Control;
