import React, { useCallback, useEffect, useRef, useState } from "react";
import { px, max } from "@/utils";
import styled from "styled-components";
import {
  useSetStateContext,
  useSetAuxiliaryLine,
  AuxliiaryLineDirs,
} from "../../state";

function makeDragable(divRef, width, onMove, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let left = 0;

  function startMove(evt) {
    left = evt.pageX - width;
    window.addEventListener("mousemove", changeWidth);
    window.addEventListener("mouseup", stopChange);
  }
  div.addEventListener("mousedown", startMove);

  function changeWidth(evt) {
    width = parseInt(max(10, evt.pageX - left));
    onMove?.(width, { x: evt.pageX, y: evt.pageY });
    // evt.stopPropagation();
  }

  function stopChange() {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    onChange?.(width);
  }

  return () => {
    window.removeEventListener("mousemove", changeWidth);
    window.removeEventListener("mouseup", stopChange);
    div.removeEventListener("mousedown", startMove);
  };
}

const ColumnCell = styled.div`
  border: 1px solid black;
  border-left: none;
  text-align: center;
  border-collapse: collapse;
  position: relative;

  .right-border {
    position: absolute;
    height: 100%;
    width: 3px;
    z-index: 1;
    top: 0;
    right: 0;

    &:hover {
      cursor: col-resize;
      background-color: red;
    }
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;

  background-color: #ffffff;

  & > * {
    flex: 0 0 auto;
  }
`;

const Column = ({ index, column, label }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(column);
  const stateContext = useSetStateContext();

  const onChange = stateContext.changeWidth;

  const auxiliaryLine = useSetAuxiliaryLine();

  const onAuxiliaryLineMove = useCallback(
    (pos, done) => {
      if (done) {
        auxiliaryLine.set(AuxliiaryLineDirs.none, pos);
      } else {
        auxiliaryLine.set(AuxliiaryLineDirs.vertical, parseInt(pos));
      }
    },
    [auxiliaryLine]
  );

  const wrapMove = useCallback(
    (width, current) => {
      console.log(`onMove ${width} ${JSON.stringify(current)}`);
      onAuxiliaryLineMove?.(current?.x);
      setWidth(width);
    },
    [onAuxiliaryLineMove, setWidth]
  );

  const wrapChange = useCallback(
    (width) => {
      console.log(`will change(${index}, ${width})`);
      onChange?.(index, width);
      onAuxiliaryLineMove?.(0, true);
    },
    [onAuxiliaryLineMove, onChange, index]
  );

  useEffect(() => {
    return makeDragable(ref, column, wrapMove, wrapChange);
  }, [ref, column, wrapChange, wrapMove]);

  return (
    <ColumnCell style={{ width: px(width), height: "100%" }}>
      <div className="header-column-label">{label}</div>
      <div className={`right-border`} ref={ref}></div>
    </ColumnCell>
  );
};

const A = "A";

function getLabel(index) {
  return String.fromCharCode(A.charCodeAt(0) + index);
}

const Page = ({ columns, className }) => {
  return (
    <ColumnsContainer className={`${className ?? ""}`}>
      {columns.map((col, index) => {
        return (
          <Column
            key={index}
            column={col}
            label={getLabel(index)}
            index={index}
          />
        );
      })}
    </ColumnsContainer>
  );
};

export default Page;
