import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import { useSvgMoving } from "../../context";
import { px, max } from "../../utils";

function makeDragable(divRef, width, onMove, setMoving, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let left = 0;

  function startMove(evt) {
    left = evt.pageX - width;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
  }
  div.addEventListener("mousedown", startMove);

  function changeWidth(evt) {
    width = parseInt(max(10, evt.pageX - left));
    onMove(width, { x: evt.pageX, y: evt.pageY });
  }

  function stopChange() {
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

const Column = ({ index, column, label, onChange }) => {
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
    return makeDragable(ref, column.width, wrapMove, setMoving, wrapChange);
  }, [ref, column.width, wrapChange, wrapMove, setMoving]);

  return (
    <div
      className="header-column grid-cell"
      style={{ width: px(width), height: "100%" }}
    >
      <div className="header-column-label">{label}</div>
      <div
        className={`header-column-right-border ${moving ? "moving" : ""}`}
        ref={ref}
      ></div>
    </div>
  );
};

const A = "A";

function getLabel(index) {
  return String.fromCharCode(A.charCodeAt(0) + index);
}

const Page = ({ columns, onChange }) => {
  return (
    <div className="header-columns-container">
      {columns.map((col, index) => {
        return (
          <Column
            key={index}
            column={col}
            label={getLabel(index)}
            index={index}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
};

export default Page;
