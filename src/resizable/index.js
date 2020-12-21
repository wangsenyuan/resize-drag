import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Region from "./region";
import Columns from "./columns";
import Rows from "./rows";
import SvgBackground from "./svg-background";
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
  return { key: region.key, top, left, height, width };
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
    children = [children];
  }

  return children.map((child) => {
    if (child.key && rects.has(child.key)) {
      return (
        <Region key={child.key} rect={rects.get(child.key)}>
          {child}
        </Region>
      );
    } else {
      return child;
    }
  });
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

function findClickRegion(regions, current) {
  for (let i in regions) {
    if (inRegion(regions[i], current)) {
      return regions[i];
    }
  }
  return null;
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

  const selectedRegion = useMemo(() => {
    if (!clipRegion) {
      return null;
    }
    return findClickRegion(regions, clipRegion);
  }, [regions, clipRegion]);

  const wrapOnClickEmptyRegion = useCallback(
    (evt) => {
      if (!onClickEmptyRegion || selectedRegion || !clipRegion) {
        return;
      }
      onClickEmptyRegion(evt, clipRegion);
    },
    [onClickEmptyRegion, selectedRegion, clipRegion]
  );

  const onGridClick = useClickAndDbClick(null, wrapOnClickEmptyRegion);

  return (
    <div className={`resizable-grid-container`}>
      <ViewBoxContext.Provider value={{ viewBox }}>
        <ClipContext.Provider value={{ clipRegion }}>
          <>
            <div className="header">
              <Toolbar className="toolbars" />
              <div className="top-left-corner"></div>
              <Columns
                className="columns"
                onChange={onChangeColumn}
                columns={columns}
              />
            </div>
            <div className="main">
              <Rows className="sidebar" rows={rows} onChange={onChangeRow} />
              <SvgBackground
                rows={rows}
                columns={columns}
                className="svg-background"
              />
              <div className="main" ref={gridRef} onClick={onGridClick}>
                {renderChildren(children, rects)}
              </div>
            </div>
          </>
        </ClipContext.Provider>
      </ViewBoxContext.Provider>
    </div>
  );
};

const Toolbar = ({ className }) => {
  return <div className={className}></div>;
};

export default ResizableGrid;
