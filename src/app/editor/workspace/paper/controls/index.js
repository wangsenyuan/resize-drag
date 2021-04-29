import React from "react";
import { useRectProperties } from "@app/editor/workspace/workspace-context";
import { CONTROLE_TYPES } from "@app/state";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@app/dnd/item-types";

function parentContainer(parentKey, childKey) {
  return true;
}

function Container({ control, parentOffset }) {
  let { children, properties, key } = control;
  const style = useRectProperties(properties, parentOffset);

  // const getEditorOffset = useGetWorkspaceOffset();

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
  if (control.type === CONTROLE_TYPES.CONTAINER) {
    return <Container control={control} parentOffset={parentOffset} />;
  }

  if (control.type === CONTROLE_TYPES.LABEL) {
    return <LableControl control={control} parentOffset={parentOffset} />;
  }

  return null;
}

export default Control;
