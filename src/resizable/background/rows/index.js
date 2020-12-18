import React, { useCallback, useEffect, useRef, useState } from "react";
import { px, max } from "../../utils";
import "./index.scss";
import { useRows, useSvgMoving } from "../../context";
import useWhyDidYouUpdate from "@/hooks/why-did-update";

function makeDragable(divRef, height, onMove, setMoving, onChange, label) {
  if (!divRef.current) {
    return;
  }
  console.log("makeDragable (" + label + ")");
  let div = divRef.current;
  let top = 0;

  function startMove(evt) {
    top = evt.pageY - height;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
    console.log("bottom line mouse down event");
  }
  div.addEventListener("mousedown", startMove);

  function changeWidth(evt) {
    height = parseInt(max(10, evt.pageY - top));
    onMove(height, { x: evt.pageX, y: evt.pageY });
  }

  function stopChange() {
    console.log("stopChange called (" + label + ")");
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange?.(height);
    setMoving(false);
  }

  return () => {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    div.removeEventListener("mousedown", startMove);
  };
}

const Row = ({ width, row, label, onChange, index }) => {
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
      onCurrentMove(null);
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
      className="grid-row grid-cell"
      style={{ width: px(width), height: px(height) }}
    >
      <div className="grid-row-label">{label}</div>
      <div
        className={`grid-row-bottom-line ${moving ? "moving" : ""}`}
        ref={ref}
      ></div>
    </div>
  );
};

const Wrapped = (props) => {
  useWhyDidYouUpdate(props.label, props);
  return <Row {...props} />;
};

const Page = ({ width, rows, height }) => {
  const { onChangeRows } = useRows();

  const onChangeRowHeight = useCallback(
    (index, height) => {
      onChangeRows((rows) => {
        let newRows = rows.map((row, pos) => {
          if (pos != index) {
            return row;
          }
          return Object.assign({}, row, { height });
        });
        return newRows;
      });
    },
    [onChangeRows]
  );

  return (
    <div
      style={{ width: px(width), height: px(height) }}
      className="rows-container"
    >
      {rows.map((row, index) => (
        <Wrapped
          width={width}
          row={row}
          key={index}
          label={index + 1}
          index={index}
          onChange={onChangeRowHeight}
        />
      ))}
    </div>
  );
};

const WrappedPage = (props) => {
  useWhyDidYouUpdate("rows", props);
  return <Page {...props} />;
};

export default WrappedPage;
