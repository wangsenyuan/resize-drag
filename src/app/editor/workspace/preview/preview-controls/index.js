import React from "react";
import { useRectProperties } from "../../workspace-context";
import { ControlTypes } from "@app/state";

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
  if (
    control.type === ControlTypes.CONTAINER ||
    control.type === ControlTypes.DUMMY
  ) {
    return <Container control={control} parentOffset={parentOffset} />;
  }

  if (
    control.type === ControlTypes.LABEL ||
    control.type === ControlTypes.FIELD
  ) {
    return <LableControl control={control} parentOffset={parentOffset} />;
  }

  return null;
}

export default Control;
