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
import { binarySearch, last, px, logWhenChange } from "./utils";

import { useWhyDidYouUpdate } from "@/hooks/why-did-update";

const initWidth = 50;
const initHeight = 50;

const ResizableElementWrapper = ({ resize, onResize, children }) => {
  logWhenChange("onResize in ResizableElementWrapper", onResize);
  return (
    <ResizeContext.Provider value={{ resize, onResize }}>
      <ResizableElem>{children}</ResizableElem>
    </ResizeContext.Provider>
  );
};

const renderChildren = (children, layouts, onResize) => {
  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    children = [children];
  }

  return children.map((child) => (
    <ResizableElementWrapper
      resize={layouts[child.key]}
      onResize={onResize}
      key={child.key}
    >
      {child}
    </ResizableElementWrapper>
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

const checkResize = (rowHeights, colWidths, resize) => {
  console.table(rowHeights);
  console.table(colWidths);
  let { top, left, width, height } = resize;

  let x1 = parseInt(left);
  let y1 = parseInt(top);
  let x2 = parseInt(x1 + width);
  let y2 = parseInt(y1 + height);

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

  console.log(`find horizontal indexes ${i} ${ii}`);
  console.log(`find vertical indexes ${j} ${jj}`);
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
  const [rowsState, setRows] = useState(rows);

  const [colsState, setCols] = useState(cols);

  const prefRowHeights = useMemo(
    () =>
      partialSum(
        0,
        rowsState.map((row) => row.height)
      ),
    [rowsState]
  );

  const prefColWidths = useMemo(
    () =>
      partialSum(
        0,
        colsState.map((col) => col.width)
      ),
    [colsState]
  );

  const gridViewBox = useMemo(() => {
    const viewBox = {
      x: initWidth,
      y: initHeight,
    };

    return { viewBox };
  }, [initWidth, initHeight]);

  const onResize = useCallback(
    (key, resize) => {
      // console.log("get resize => " + JSON.stringify(resize));
      resize = checkResize(prefRowHeights, prefColWidths, resize);
      let newLayouts = Object.assign({}, layouts);
      newLayouts[key] = resize;
      onLayoutChange(newLayouts);
      return resize;
    },
    [onLayoutChange, layouts, prefColWidths, prefRowHeights]
  );

  logWhenChange("onResize", onResize);

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

const WrapGrid = (props) => {
  useWhyDidYouUpdate("grid", props);
  return <ResizableGrid {...props} />;
};

export default WrapGrid;
