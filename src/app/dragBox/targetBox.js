import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './itemTypes';

const Dustbin = ({ children }) => {
  const ref = useRef(null);

  const [{ canDrop, isOver, handlerId }, drop] = useDrop(() => ({
      accept: ItemTypes.BOX,
      // collect(monitor) {
      //   return {
      //     handlerId: monitor.getHandlerId(),
      //   };
      // },
      drop(item, monitor) {
        // console.log(item, monitor)
      },
      hover(item, monitor) {
        // console.log(item)
        // console.log(monitor)
        if (!ref.current) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
         // 获取中点垂直坐标
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // 确定鼠标位置
        const clientOffset = monitor.getClientOffset();

        // 获取距顶部距离
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // console.log(hoverBoundingRect, hoverMiddleY, clientOffset, hoverClientY)
      },
  }));
  // const isActive = canDrop && isOver;
  drop(ref)
  return (
    <div ref={ref} role={'Dustbin'} data-handler-id={handlerId}>
      {children}
    </div>
  );
}

export default Dustbin;