import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import { useColumns } from "../../context";
import { px, max } from "../../utils";

function makeDragable(divRef, width, onMove, setMoving, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let left = 0;

  div.addEventListener("mousedown", function (evt) {
    left = evt.pageX - width;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
  });

  function changeWidth(evt) {
    width = parseInt(max(10, evt.pageX - left));
    onMove(width);
  }

  function stopChange() {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange && onChange(width);
    setMoving(false);
  }
}

const Column = ({ column, label, height, onChange }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(column.width);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    makeDragable(ref, column.width, setWidth, setMoving, onChange);
  }, [ref, column.width, onChange, setWidth, setMoving]);

  return (
    <div
      className="grid-column grid-cell"
      style={{ width: px(width), height: px(height) }}
    >
      <div className="grid-column-label">{label}</div>
      <div
        className={`grid-column-right-border ${moving ? "moving" : ""}`}
        ref={ref}
      ></div>
    </div>
  );
};

const A = "A";

function getLabel(index) {
  return String.fromCharCode(A.charCodeAt(0) + index);
}

const Page = ({ left, width, height, columns }) => {
  const { onChangeColumns } = useColumns();

  const onChangeColumnWidth = useCallback(
    (index, width) => {
      onChangeColumns((cols) => {
        return cols.map((col, pos) => {
          if (pos === index) {
            return Object.assign({}, col, { width });
          }
          return col;
        });
      });
    },
    [onChangeColumns]
  );

  return (
    <div
      className="columns-container"
      style={{
        height: px(height),
        width: px(width),
        position: "absolute",
        top: 0,
        left: px(left),
      }}
    >
      {columns.map((col, index) => {
        return (
          <Column
            key={index}
            column={col}
            label={getLabel(index)}
            height={height}
            onChange={(width) => onChangeColumnWidth(index, width)}
          />
        );
      })}
    </div>
  );
};

export default Page;
