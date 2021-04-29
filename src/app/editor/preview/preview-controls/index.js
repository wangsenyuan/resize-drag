import React, { useMemo } from "react";
import { useRectProperties } from "../../workspace/workspace-context";
import { CONTROLE_TYPES } from "@app/state";

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
  console.log(`will render control ${JSON.stringify(control)}`);

  if (control.type === CONTROLE_TYPES.CONTAINER) {
    return <Container control={control} parentOffset={parentOffset} />;
  }

  if (control.type === CONTROLE_TYPES.LABEL) {
    return <LableControl control={control} parentOffset={parentOffset} />;
  }

  return null;
}

export default Control;
