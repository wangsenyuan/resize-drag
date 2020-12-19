import React, { useMemo, useState } from "react";
import { RowsContext, ColumnsContext, ViewBoxContext } from "./context";
import ResizableElem from "./elem";
import Background from "./background";
import "./index.scss";
import { binarySearch, last, px } from "./utils";

const initWidth = 50;
const initHeight = 50;

const renderChildren = (children) => {
  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    children = [children];
  }

  return children.map((child) => (
    <ResizableElem key={child.key}>{child}</ResizableElem>
  ));
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

function getCoordinates(rect) {
  let { top, left, width, height } = rect;

  let x1 = parseInt(left);
  let y1 = parseInt(top);
  let x2 = parseInt(x1 + width);
  let y2 = parseInt(y1 + height);
  return { x1, y1, x2, y2 };
}

const checkResize = (rowHeights, colWidths, resize) => {
  let { x1, y1, x2, y2 } = getCoordinates(resize);

  let i = binarySearch(colWidths.length, (i) => colWidths[i] >= x1);
  let j = binarySearch(rowHeights.length, (j) => rowHeights[j] >= y1);
  let ii = binarySearch(colWidths.length, (ii) => colWidths[ii] > x2) - 1;
  let jj = binarySearch(rowHeights.length, (jj) => rowHeights[jj] > y2) - 1;

  if (i === ii) {
    if (ii < colWidths.length - 1) {
      ii++;
    } else {
      i--;
    }
  }

  if (j === jj) {
    if (jj < rowHeights.length - 1) {
      jj++;
    } else {
      j--;
    }
  }
  x1 = colWidths[i];
  y1 = rowHeights[j];
  x2 = colWidths[ii];
  y2 = rowHeights[jj];
  return Object.assign({}, resize, {
    top: y1,
    left: x1,
    width: x2 - x1,
    height: y2 - y1,
  });
};

function overlap(rect1, rect2) {
  let { x1, y1, x2, y2 } = getCoordinates(rect1);
  let { x1: u1, y1: v1, x2: u2, y2: v2 } = getCoordinates(rect2);

  return u1 < x2 && v1 < y2 && x1 < u2 && y1 < v2;
}

const createCanReach = (rowHeights, colWidths, layouts) => {
  function canReach(key, resize) {
    resize = checkResize(rowHeights, colWidths, resize);

    for (let cur in layouts) {
      if (cur === key) {
        continue;
      }
      if (overlap(resize, layouts[cur])) {
        return false;
      }
    }
    return true;
  }

  return canReach;
};

const ResizableGrid = ({
  className,
  layouts,
  rows,
  onChangeRows,
  cols,
  onChangeCols,
  onLayoutChange,
  children,
  style,
  ...rest
}) => {
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
    };

    const canReach = createCanReach(prefRowHeights, prefColWidths, layouts);

    const onResize = (key, resize) => {
      resize = checkResize(prefRowHeights, prefColWidths, resize);
      let newLayouts = Object.assign({}, layouts);
      newLayouts[key] = resize;
      onLayoutChange(newLayouts);
      return resize;
    };

    const getResize = (key) => layouts[key];

    return { viewBox, canReach, onResize, getResize };
  }, [
    initWidth,
    initHeight,
    layouts,
    prefColWidths,
    prefRowHeights,
    onLayoutChange,
  ]);

  return (
    <div
      className={`${className} resizable-grid-container`}
      style={{ position: "relative", ...style }}
      {...rest}
    >
      {renderBackground(
        rows,
        onChangeRows,
        cols,
        onChangeCols,
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
            {renderChildren(children, layouts)}
          </div>
        </ViewBoxContext.Provider>
      </div>
    </div>
  );
};

export default ResizableGrid;
