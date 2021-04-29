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

  const [, dropRef] = useDrop(() => {
    console.log("useDrop options");
    return {
      accept: [ControlTypes.LABEL, ControlTypes.CONTAINER],
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return monitor.getDropResult();
        }
        console.log("drop called");
      },
    };
  }, []);

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
