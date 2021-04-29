import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './itemTypes';
import { useGetStateContext } from '../state';

const Dustbin = ({ children }) => {
  const { layout } = useGetStateContext();
  const { columns, rows } =  layout
  const ref = useRef(null);
  const [{ canDrop, isOver, handlerId }, drop] = useDrop(() => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        console.log(item, monitor)
      },
      hover(item, monitor) {
        // console.log(item)
        // console.log(monitor)
        if (!ref.current) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // 确定鼠标位置
        const clientOffset = monitor.getClientOffset();
        // 获取距顶部距离
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // console.log(hoverBoundingRect, clientOffset, hoverClientY)
        const { x: parentX, y: parentY } = hoverBoundingRect;
        const { x, y } = clientOffset;
        let offsetX = x - parentX;
        let offsetY = y - parentY;
        let x1 = 0;
        let y1 = 0;
        for (let index = 0; index < columns.length; index++) {
          offsetX = offsetX - columns[index];
          if (offsetX < 0) {
            x1 = index + 1;
            break;
          }
        }
        for (let index = 0; index < rows.length; index++) {
          offsetY = offsetY - rows[index];
          if (offsetY < 0) {
            y1 = index + 1;
            break;
          }
        }
        console.log(x1, y1)
        item.x1 = x1;
        item.y1 = y1;
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