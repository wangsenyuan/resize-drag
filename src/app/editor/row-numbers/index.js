import React, { useCallback, useEffect, useRef, useState } from "react";
import { px, max } from "@/utils";
import { AuxliiaryLineDirs, useSetAuxiliaryLine } from "../editor-context";
import { useSetStateContext } from "../../state";
import styled from "styled-components";
import { offEditorScroll, onEditorScroll } from "../events";

function makeDragable(divRef, height, onMove, onChange) {
  if (!divRef.current) {
    return;
  }
  let div = divRef.current;
  let top = 0;

  function startMove(evt) {
    top = evt.pageY - height;
    window.addEventListener("mousemove", changeHeight);
    window.addEventListener("mouseup", stopChange);
  }
  div.addEventListener("mousedown", startMove);

  function changeHeight(evt) {
    height = parseInt(max(10, evt.pageY - top));
    onMove(height, { y: evt.pageY });
  }

  function stopChange(evt) {
    window.removeEventListener("mousemove", changeHeight);
    window.removeEventListener("mouseup", stopChange);
    onChange(height);
  }

  return () => {
    window.removeEventListener("mousemove", changeHeight);
    window.removeEventListener("mouseup", stopChange);
    div.removeEventListener("mousedown", startMove);
  };
}

const RowContainer = styled.div`
  overflow-y: hidden;
  width: 100%;
  height: 100%;
`;

const RowCell = styled.div`
  border: 1px solid black;
  border-top: none;
  text-align: center;
  border-collapse: collapse;

  .header-row-label {
    height: calc(100%);
  }

  position: relative;

  div.bottom-line {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 1;

    &:hover {
      cursor: row-resize;
    }

    &.moving {
      background-color: red;
    }
  }
`;

const Row = ({ row, label, index }) => {
  const ref = useRef(null);

  const [height, setHeight] = useState(row);

  const stateContext = useSetStateContext();

  const auxiliaryLine = useSetAuxiliaryLine();

  const onCurrentMove = useCallback(
    (pos, done) => {
      if (done) {
        auxiliaryLine.set(AuxliiaryLineDirs.none, pos);
      } else {
        auxiliaryLine.set(AuxliiaryLineDirs.horizontal, parseInt(pos));
      }
    },
    [auxiliaryLine]
  );

  const wrapMove = useCallback(
    (height, current) => {
      onCurrentMove?.(current.y);
      setHeight(height);
    },
    [onCurrentMove, setHeight]
  );

  const wrapChange = useCallback(
    (height) => {
      stateContext.changeHeight?.(index, height);
      onCurrentMove?.(0, true);
    },
    [stateContext, onCurrentMove, index]
  );

  useEffect(() => {
    let clean = makeDragable(ref, row, wrapMove, wrapChange);
    return clean;
  }, [ref, row, wrapMove, wrapChange]);

  return (
    <RowCell
      className="header-row grid-cell"
      style={{ height: px(height), width: "100%" }}
    >
      <div className="header-row-label">{label}</div>
      <div className={`bottom-line `} ref={ref}></div>
    </RowCell>
  );
};

const Page = ({ rows, className }) => {
  const divRef = useRef(null);

  useEffect(() => {
    function fn({ scrollTop }) {
      divRef.current.scrollTop = scrollTop;
    }
    onEditorScroll(fn);

    return () => {
      offEditorScroll(fn);
    };
  }, [divRef]);

  return (
    <RowContainer className={`${className ?? ""}`} ref={divRef}>
      <div className="rows">
        {rows.map((row, index) => (
          <Row row={row} key={index} label={index + 1} index={index} />
        ))}
      </div>
    </RowContainer>
  );
};

export default Page;
