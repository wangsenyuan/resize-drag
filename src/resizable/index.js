import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResizeContext,
  RowsContext,
  ColumnsContext,
  ViewBoxContext,
} from "./context";
import ResizableElem from "./elem";
import Background from "./background";
import "./index.scss";
import { last, px } from "./utils";

const initWidth = 50;
const initHeight = 50;
const wrapResizable = (layouts, onResize, children) => {
  return (
    <ResizeContext.Provider
      key={children.key}
      value={{
        resize: layouts[children.key],
        onResize: (layout) => onResize(children.key, layout),
      }}
    >
      <ResizableElem>{children}</ResizableElem>
    </ResizeContext.Provider>
  );
};

const renderChildren = (children, layouts, onResize) => {
  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    return wrapResizable(layouts, onResize, children);
  }

  return children.map((child) => wrapResizable(layouts, onResize, child));
};

const renderBackground = (
  rows,
  onChangeRows,
  cols,
  onChangeCols,
  prefRowHeights,
  prefColWidths
) => {
  return (
    <ColumnsContext.Provider value={{ onChangeColumns: onChangeCols }}>
      <RowsContext.Provider value={{ onChangeRows }}>
        <Background
          rows={rows}
          cols={cols}
          initHeight={initHeight}
          initWidth={initWidth}
          prefRowHeights={prefRowHeights}
          prefColWidths={prefColWidths}
        />
      </RowsContext.Provider>
    </ColumnsContext.Provider>
  );
};

const partialSum = (initValue, nums) => {
  let res = [initValue, ...nums];
  for (let i = 1; i < res.length; i++) {
    res[i] += res[i - 1];
  }
  return res;
};

const ResizableGrid = ({
  className,
  layouts,
  rows,
  cols,
  onLayoutChange,
  children,
  style,
  ...rest
}) => {
  const onResize = useCallback(
    (key, resize) => {
      console.log("get resize => " + JSON.stringify(resize));
      let newLayouts = Object.assign({}, layouts);
      newLayouts[key] = resize;
      onLayoutChange(newLayouts);
      return resize;
    },
    [onLayoutChange, layouts]
  );

  const [rowsState, setRows] = useState(rows);

  const [colsState, setCols] = useState(cols);

  const prefRowHeights = useMemo(
    () =>
      partialSum(
        0,
        rows.map((row) => row.height)
      ),
    [rows]
  );

  const prefColWidths = useMemo(
    () =>
      partialSum(
        0,
        cols.map((col) => col.width)
      ),
    [cols]
  );

  const gridViewBox = useMemo(() => {
    const viewBox = {
      x: initWidth,
      y: initHeight,
      width: last(prefColWidths),
      height: last(prefRowHeights),
    };
    return { viewBox };
  }, [initWidth, initHeight, prefColWidths, prefRowHeights]);

  return (
    <div
      className={`${className} resizable-grid-container`}
      style={{ position: "relative", ...style }}
      {...rest}
    >
      {renderBackground(
        rowsState,
        setRows,
        colsState,
        setCols,
        prefRowHeights,
        prefColWidths
      )}
      <div
        className="resizable-grid-forground"
        style={{
          top: px(initHeight),
          left: px(initWidth),
          width: px(last(prefColWidths)),
          height: px(last(prefRowHeights)),
          position: "absolute",
        }}
      >
        <ViewBoxContext.Provider value={gridViewBox}>
          <div className="resizable-grid">
            {renderChildren(children, layouts, onResize)}
          </div>
        </ViewBoxContext.Provider>
      </div>
    </div>
  );
};

export default ResizableGrid;
