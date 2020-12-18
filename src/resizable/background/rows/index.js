import React, { useCallback, useEffect, useRef, useState } from "react";
import { px, max } from "../../utils";
import "./index.scss";
import { useRows } from "../../context";

function makeDragable(divRef, height, onMove, setMoving, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let top = 0;

  div.addEventListener("mousedown", function (evt) {
    top = evt.pageY - height;
    setMoving(true);
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
    console.log("bottom line mouse down event");
  });

  function changeWidth(evt) {
    height = parseInt(max(10, evt.pageY - top));
    onMove(height);
  }

  function stopChange() {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange && onChange(height);
    setMoving(false);
  }
}

const Row = ({ width, row, label, onChange }) => {
  const ref = useRef(null);

  const [height, setHeight] = useState(row.height);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    makeDragable(ref, row.height, setHeight, setMoving, onChange);
  }, [ref, row.height, setHeight, setMoving, onChange]);

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
        <Row
          width={width}
          row={row}
          key={index}
          label={index + 1}
          onChange={(height) => onChangeRowHeight(index, height)}
        />
      ))}
    </div>
  );
};

export default Page;
