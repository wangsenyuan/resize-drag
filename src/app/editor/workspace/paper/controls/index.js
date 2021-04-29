import React, { useRef } from "react";
import { useRectProperties } from "@app/editor/workspace/workspace-context";
import { ControlTypes } from "@app/state";
import { useDrop } from "react-dnd";

function parentContainer(parentKey, childKey) {
  return true;
}

function Container({ control, parentOffset }) {
  let { children, properties, key } = control;
  const style = useRectProperties(properties, parentOffset);

  const [, dropRef] = useDrop(
    {
      accept: [ControlTypes.CONTAINER, ControlTypes.FIELD, ControlTypes.LABEL],
      canDrop: (item, monitor) => parentContainer(key, item.key),
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return monitor.getDropResult();
        }
        console.log("drop");
      },
      hover: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          let { x, y } = monitor.getClientOffset();
          // let { x: nx, y: ny } = getEditorOffset(x, y);
          // console.log(`hove at x = ${x} y = ${y} nx = ${nx} ny = ${ny}`);
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
  if (control.type === ControlTypes.CONTAINER) {
    return <Container control={control} parentOffset={parentOffset} />;
  }

  if (control.type === ControlTypes.LABEL) {
    return <LableControl control={control} parentOffset={parentOffset} />;
  }

  return null;
}

export default Control;
