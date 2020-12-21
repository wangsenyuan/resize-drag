import React, { useCallback, useEffect, useRef, useState } from "react";
import { px, max } from "../utils";
import "./index.scss";
import { useSvgMoving } from "../context";

function makeDragable(divRef, height, onMove, setMoving, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let top = 0;

  function startMove(evt) {
    top = evt.pageY - height;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
  }
  div.addEventListener("mousedown", startMove);

  function changeWidth(evt) {
    height = parseInt(max(10, evt.pageY - top));
    onMove(height, { x: evt.pageX, y: evt.pageY });
  }

  function stopChange(evt) {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange(height);
    setMoving(false);
  }

  return () => {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    div.removeEventListener("mousedown", startMove);
  };
}

const Row = ({ row, label, onChange, index }) => {
  const ref = useRef(null);

  const [height, setHeight] = useState(row.height);
  const [moving, setMoving] = useState(false);

  const { onCurrentMove } = useSvgMoving();

  const wrapMove = useCallback(
    (height, current) => {
      onCurrentMove?.({ dir: "horizontal", ...current });
      setHeight(height);
    },
    [onCurrentMove, setHeight]
  );

  const wrapChange = useCallback(
    (height) => {
      onChange?.(index, height);
      onCurrentMove?.(null);
    },
    [onChange, onCurrentMove, index]
  );

  useEffect(() => {
    let clean = makeDragable(
      ref,
      row.height,
      wrapMove,
      setMoving,
      wrapChange,
      label
    );
    return clean;
  }, [ref, row.height, wrapMove, setMoving, wrapChange, index]);

  return (
    <div
      className="header-row grid-cell"
      style={{ height: px(height), width: "100%" }}
    >
      <div className="header-row-label">{label}</div>
      <div
        className={`header-row-bottom-line ${moving ? "moving" : ""}`}
        ref={ref}
      ></div>
    </div>
  );
};

const Page = ({ rows, onChange, className }) => {
  return (
    <div className={`header-rows-container ${className}`}>
      {rows.map((row, index) => (
        <Row
          row={row}
          key={index}
          label={index + 1}
          index={index}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default Page;
