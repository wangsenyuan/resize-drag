import React, { memo, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CONTROLE_TYPES } from "@app/state";
import { getRandomString } from "@/utils";

const style = {
  cursor: "move",
};

const SourceBox = memo(function SourceBox({ children, acceptType, type }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: CONTROLE_TYPES.LABEL,
    item: () => {
      return {
        type: CONTROLE_TYPES.LABEL,
        key: "1",
        defKey: getRandomString(),
      };
    },
    end: (dropResult, monitor) => {
      console.log("drag end");
      // console.log(dropResult, monitor)
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
    <div
      ref={drag}
      role="Box"
      style={{ ...style, opacity }}
      data-testid={`box-${type}`}
    >
      {children}
    </div>
  );
});

export default SourceBox;
