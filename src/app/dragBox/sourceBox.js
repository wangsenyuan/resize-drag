import React, { memo, useEffect } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import ItemTypes from "./itemTypes";
import { preViewImage } from "./preViewImg";
import { getEmptyImage } from "react-dnd-html5-backend";

const style = {
  cursor: "move",
};

const SourceBox = memo(function SourceBox({ children, acceptType, type }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { type },

    spec: {
      begin: (monitor) => {
        // console.log(monitor)
      },
    },
    end: (dropResult, monitor) => {
      console.log("end drag");
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <>
      <div
        ref={drag}
        role="Box"
        style={{ ...style, opacity }}
        data-testid={`box-${type}`}
      >
        {children}
      </div>
    </>
  );
});

export default SourceBox;
