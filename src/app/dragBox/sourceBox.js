import React, { memo, useState } from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './itemTypes';

const style = {
  cursor: 'move',
};

const SourceBox = memo(function SourceBox({ children, acceptType, type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
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
      // console.log(dropResult, monitor)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} role="Box" style={{ ...style, opacity }} data-testid={`box-${type}`}>
			{children}
		</div>
  );
})

export default SourceBox;