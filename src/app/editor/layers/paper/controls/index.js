import React, { useCallback, useMemo } from "react";
import { useViewBox, useGetEditorOffsetContext } from "../../../editor-context";
import { getViewRect, px } from "@/utils";
import { CONTROLE_TYPES, useSetStateContext } from "@app/state";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@app/dnd/item-types";

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

function parentContainer(parentKey, childKey) {
  // if (!childKey.startsWith(parentKey)) {
  //   return false;
  // }
  // let x = childKey.indexOf(parentKey.length);
  // if (x !== ".") {
  //   return false;
  // }
  return true;
}

function Container({ control, parentOffset }) {
  let { children, properties, key } = control;
  const style = useRectProperties(properties, parentOffset);

  const setStateContext = useSetStateContext();

  const handleDrop = useCallback(() => {}, [setStateContext]);

  const getEditorOffset = useGetEditorOffsetContext();

  const [, dropRef] = useDrop(
    {
      accept: [ItemTypes.CONTAINER, ItemTypes.FIELD, ItemTypes.LABEL],
      canDrop: (item, monitor) => parentContainer(key, item.key),
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return monitor.getDropResult();
        }
      },
      hover: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          let { x, y } = monitor.getClientOffset();
          let { x: nx, y: ny } = getEditorOffset(x, y);
          console.log(`hove at x = ${x} y = ${y} nx = ${nx} ny = ${ny}`);
        }
      },
    },
    [key]
  );

  return (
    <div style={style} ref={dropRef}>
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
