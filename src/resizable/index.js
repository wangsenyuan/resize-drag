import React, { useCallback, useMemo, useState } from "react";
import { RowsContext, ColumnsContext, ViewBoxContext } from "./context";
import ResizableElem from "./elem";
import Background from "./background";
import "./index.scss";
import { binarySearch, last, px, partialSum } from "./utils";

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

const calcResize = (layout, rowHeights, colWidths) => {
  let { rect } = layout;
  let { r1, c1, r2, c2 } = rect;
  let top = rowHeights[r1];
  let left = colWidths[c1];
  let height = rowHeights[r2 + 1] - top;
  let width = colWidths[c2 + 1] - left;
  return { top, left, width, height };
};

const calcResizes = (layouts, rowHeights, colWidths) => {
  let resizes = {};

  for (let key in layouts) {
    let layout = layouts[key];
    resizes[key] = calcResize(layout, rowHeights, colWidths);
  }

  return resizes;
};

const calcLayoutRect = (resize, rowHeights, colWidths) => {
  console.log("calLayoutRect for (" + JSON.stringify(resize) + ")");
  let { top, left, height, width } = resize;
  let i = binarySearch(rowHeights.length, (i) => rowHeights[i] > top) - 1;
  let j = binarySearch(colWidths.length, (j) => colWidths[j] > left) - 1;
  let k =
    binarySearch(rowHeights.length, (k) => rowHeights[k] >= top + height) - 1;
  let l =
    binarySearch(colWidths.length, (l) => colWidths[l] >= left + width) - 1;

  let res = { r1: i, c1: j, r2: k, c2: l };

  console.log("result is " + JSON.stringify(res));
  console.log(
    "it resize is " +
      JSON.stringify(calcResize({ rect: res }, rowHeights, colWidths))
  );

  return res;
};

const memoPartialSum = (arr, initValue, mapper) => {
  return useMemo(() => partialSum(initValue, arr.map(mapper)), [arr]);
};

const ResizableGrid = ({
  className,
  rows,
  onChangeRows,
  cols,
  onChangeCols,
  layouts,
  onChangeLayout,
  children,
  ...rest
}) => {
  const prefRowHeights = memoPartialSum(rows, 0, (row) => row.height);

  const prefColWidths = memoPartialSum(cols, 0, (col) => col.width);

  const resizes = useMemo(() => {
    return calcResizes(layouts, prefRowHeights, prefColWidths);
  }, [layouts, prefColWidths, prefRowHeights]);

  const onChangeResize = useCallback(
    (key, resize) => {
      onChangeLayout(
        key,
        calcLayoutRect(resize, prefRowHeights, prefColWidths)
      );
    },
    [onChangeLayout, prefRowHeights, prefColWidths]
  );

  const gridViewBox = useMemo(() => {
    const viewBox = {
      x: initWidth,
      y: initHeight,
    };

    const canReach = createCanReach(prefRowHeights, prefColWidths, resizes);

    const onResize = (key, resize) => {
      resize = checkResize(prefRowHeights, prefColWidths, resize);
      onChangeResize(key, resize);
      return resize;
    };

    const getResize = (key) => resizes[key];

    return { viewBox, canReach, onResize, getResize };
  }, [
    initWidth,
    initHeight,
    resizes,
    prefColWidths,
    prefRowHeights,
    onChangeResize,
  ]);

  return (
    <div
      className={`${className} resizable-grid-container`}
      style={{ position: "relative" }}
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
          <div className="resizable-grid">{renderChildren(children)}</div>
        </ViewBoxContext.Provider>
      </div>
    </div>
  );
};

export default ResizableGrid;
