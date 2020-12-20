import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Region from "./region";
import Background from "./background";
import "./index.scss";
import { partialSum, createAction, last, px, getElementOffset } from "./utils";
import { ClipContext, ViewBoxContext } from "./context";
import { useClipRegion } from "./clip-region";
import { useClickAndDbClick } from "@/hooks/wrap-click";

const memoPartialSum = (arr, initValue, mapper) => {
  return useMemo(() => partialSum(initValue, arr.map(mapper)), [arr]);
};

const createRect = (region, rowHeights, columnWidths) => {
  let { r1, c1, r2, c2 } = region;
  let top = rowHeights[r1];
  let left = columnWidths[c1];
  let height = rowHeights[r2 + 1] - top;
  let width = columnWidths[c2 + 1] - left;
  return { top, left, height, width };
};

const createRects = (regions, rowHeights, columnWidths) => {
  return useMemo(() => {
    let mem = new Map();
    regions.forEach((region) => {
      let res = createRect(region, rowHeights, columnWidths);
      mem.set(region.key, res);
    });
    return mem;
  }, [regions, rowHeights, columnWidths]);
};

const renderChildren = (children, rects) => {
  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    if (!children.key || rects.has(children.key)) {
      return null;
    }
    return <Region rect={rects.get(children.key)}>{children}</Region>;
  }

  return children
    .filter((child) => rects.has(child.key))
    .map((child) => (
      <Region key={child.key} rect={rects.get(child.key)}>
        {child}
      </Region>
    ));
};

const renderBackground = (rows, columns, onChangeRow, onChangeColumn) => {
  return (
    <Background
      rows={rows}
      columns={columns}
      onChangeRow={onChangeRow}
      onChangeColumn={onChangeColumn}
    />
  );
};

const createViewBox = (heights, widths, divRef) => {
  const [viewBox, setViewBox] = useState({
    heights,
    widths,
    width: last(widths),
    height: last(heights),
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    if (divRef.current) {
      const div = divRef.current;
      let { offsetX, offsetY } = getElementOffset(div);
      console.log("get offset {" + offsetX + ", " + offsetY + "}");
      offsetX = Math.floor(offsetX);
      offsetY = Math.floor(offsetY);
      setViewBox((viewBox) => {
        let newBox = Object.assign({}, viewBox, {
          heights,
          widths,
          width: last(widths),
          height: last(heights),
          offsetX,
          offsetY,
        });
        return newBox;
      });
    }
  }, [heights, widths, divRef.current, setViewBox]);

  return viewBox;
};

function inRegion(region, current) {
  return (
    region.r1 <= current.r1 &&
    region.c1 <= current.c1 &&
    current.r2 <= region.r2 &&
    current.c2 <= region.c2
  );
}

function checkEmptyRegion(regions, current) {
  for (let i in regions) {
    if (inRegion(regions[i], current)) {
      return false;
    }
  }
  return true;
}

const ResizableGrid = ({
  layout: { rows, columns, regions },
  onChangeLayout,
  children,
  onClickEmptyRegion,
}) => {
  const prefRowHeights = memoPartialSum(rows, 0, (row) => row.height);

  const prefColWidths = memoPartialSum(columns, 0, (col) => col.width);

  const rects = createRects(regions, prefRowHeights, prefColWidths);

  const onChangeRow = useCallback(
    (index, height) => {
      onChangeLayout(createAction("change-row", { index, height }));
    },
    [onChangeLayout]
  );

  const onChangeColumn = useCallback(
    (index, width) => {
      onChangeLayout(createAction("change-column", { index, width }));
    },
    [onChangeLayout]
  );

  const gridRef = useRef(null);

  const viewBox = createViewBox(prefRowHeights, prefColWidths, gridRef);

  const { clipRegion } = useClipRegion(
    gridRef,
    prefRowHeights,
    prefColWidths,
    rects,
    viewBox
  );

  const wrapOnClickEmptyRegion = useCallback(
    (evt) => {
      if (!onClickEmptyRegion || !clipRegion) {
        return null;
      }
      if (checkEmptyRegion(regions, clipRegion)) {
        onClickEmptyRegion(evt, clipRegion);
      }
    },
    [onClickEmptyRegion, regions, clipRegion]
  );

  const onGridClick = useClickAndDbClick(null, wrapOnClickEmptyRegion);

  return (
    <div className={`resizable-grid-container`}>
      <ViewBoxContext.Provider value={{ viewBox }}>
        <ClipContext.Provider value={{ clipRegion }}>
          <>
            {renderBackground(rows, columns, onChangeRow, onChangeColumn)}
            <div
              onClick={onGridClick}
              ref={gridRef}
              className="resizable-grid"
              style={{
                width: px(viewBox.width),
                height: px(viewBox.height),
              }}
            >
              {renderChildren(children, rects)}
            </div>
          </>
        </ClipContext.Provider>
      </ViewBoxContext.Provider>
    </div>
  );
};

export default ResizableGrid;
