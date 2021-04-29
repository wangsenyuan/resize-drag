import React, { memo, useEffect } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const style = {
  cursor: "move",
};

const SourceBox = memo(function SourceBox({ children, acceptType, type }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: type,
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
