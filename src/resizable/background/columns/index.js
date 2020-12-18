import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import { useColumns, useSvgMoving } from "../../context";
import { px, max } from "../../utils";

function makeDragable(divRef, width, onMove, setMoving, onChange, label) {
  if (!divRef.current) {
    return;
  }
  console.log("makeDragable (" + label + ")");
  let div = divRef.current;
  let left = 0;

  function startMove(evt) {
    left = evt.pageX - width;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
    console.log("bottom line mouse down event");
  }
  div.addEventListener("mousedown", startMove);

  function changeWidth(evt) {
    width = parseInt(max(10, evt.pageX - left));
    onMove(width, { x: evt.pageX, y: evt.pageY });
  }

  function stopChange() {
    console.log("stopChange called (" + label + ")");
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange?.(width);
    setMoving(false);
  }

  return () => {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    div.removeEventListener("mousedown", startMove);
  };
}

const Column = ({ index, column, label, height, onChange }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(column.width);
  const [moving, setMoving] = useState(false);

  const { onCurrentMove } = useSvgMoving();

  const wrapMove = useCallback(
    (width, current) => {
      onCurrentMove?.({ dir: "vertical", ...current });
      setWidth(width);
    },
    [onCurrentMove, setWidth]
  );

  const wrapChange = useCallback(
    (width) => {
      onChange?.(index, width);
      onCurrentMove?.(null);
    },
    [onCurrentMove, onChange, index]
  );

  useEffect(() => {
    return makeDragable(
      ref,
      column.width,
      wrapMove,
      setMoving,
      wrapChange,
      label
    );
  }, [ref, column.width, wrapChange, wrapMove, setMoving]);

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
            index={index}
            onChange={onChangeColumnWidth}
          />
        );
      })}
    </div>
  );
};

export default Page;
