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

const FIRST_HEIGHT = 50;
const FIRST_WIDTH = 60;

const createViewBox = (heights, widths, divRef) => {
  const [viewBox, setViewBox] = useState({
    top: 0,
    left: 0,
    heights,
    widths,
    width: last(widths),
    height: last(heights),
    offsetX: FIRST_WIDTH,
    offsetY: FIRST_HEIGHT,
  });

  useEffect(() => {
    if (divRef.current) {
      const div = divRef.current;
      let { top, left } = getElementOffset(div);
      top = Math.floor(top);
      left = Math.floor(left);

      setViewBox((viewBox) => {
        let newBox = Object.assign({}, viewBox, {
          top,
          left,
          heights,
          widths,
          width: last(widths),
          height: last(heights),
          offsetX: FIRST_WIDTH + left,
          offsetY: FIRST_HEIGHT + top,
        });
        return newBox;
      });
    }
  }, [heights, widths, divRef, setViewBox]);

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

  const ref = useRef(null);

  const viewBox = createViewBox(prefRowHeights, prefColWidths, ref);

  const gridRef = useRef(null);

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
    <div className={`resizable-grid-container`} ref={ref}>
      <ViewBoxContext.Provider value={{ viewBox }}>
        <ClipContext.Provider value={{ clipRegion }}>
          <>
            <div className={"resiable-grid-background"}>
              {renderBackground(rows, columns, onChangeRow, onChangeColumn)}
            </div>
            <div
              onClick={onGridClick}
              ref={gridRef}
              className="resizable-grid"
              style={{
                width: px(viewBox.width),
                height: px(viewBox.height),
                marginTop: `-${px(viewBox.height)}`,
                marginLeft: `${px(FIRST_WIDTH)}`,
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
