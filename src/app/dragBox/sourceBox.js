import React, { memo, useState } from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import ItemTypes from './itemTypes';
import { preViewImage } from './preViewImg';

const style = {
  cursor: 'move',
};

const SourceBox = memo(function SourceBox({ children, acceptType, type }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { type },

    spec: {
      begin: monitor => {
        // console.log(monitor)
      },
    },
    end: (dropResult, monitor) => {
      console.log(monitor.getItem())
      console.log(monitor)
      console.log(dropResult)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1;

  return (
    <>
      <DragPreviewImage connect={preview} src={preViewImage}/>
      <div ref={drag} role="Box" style={{ ...style, opacity }} data-testid={`box-${type}`}>
        {children}
      </div>
    </>
  );
})

export default SourceBox;