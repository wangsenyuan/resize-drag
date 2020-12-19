import { useCallback, useEffect, useMemo, useState } from "react";
import { binarySearch, max, min } from "../utils";

function createListeners(elementRef, onMove) {
  if (!elementRef.current) {
    return;
  }

  let element = elementRef.current;
  let rect = null;
  function start(evt) {
    rect = { x1: 0, y1: 0, x2: 0, y2: 0 };
    rect.x1 = Math.floor(evt.pageX);
    rect.y1 = Math.floor(evt.pageY);
    element.addEventListener("mousemove", move);
    element.addEventListener("mouseup", stop);
    element.addEventListener("mouseleave", stop);
  }

  function move(evt) {
    if (!rect) {
      return;
    }
    rect.x2 = Math.floor(evt.pageX);
    rect.y2 = Math.floor(evt.pageY);
    onMove(Object.assign({}, rect, { moving: true }));
    // console.log("after move (" + JSON.stringify(rect) + ")");
  }

  function cleanListeners() {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mousedown", start);
    element.removeEventListener("mouseleave", stop);
  }

  function stop(evt) {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    if (!rect) {
      return;
    }
    rect.x2 = Math.floor(evt.pageX);
    rect.y2 = Math.floor(evt.pageY);
    onMove(rect);
    rect = null;
  }

  element.addEventListener("mousedown", start);

  return cleanListeners;
}

function regionToRect(region) {
  let { top, left, width, height } = region;
  let x1 = left;
  let y1 = top;
  let x2 = width + left;
  let y2 = height + top;
  return { x1, y1, x2, y2 };
}

function overlap(a, b) {
  let res = b.x1 < a.x2 && b.y1 < a.y2 && a.x1 < b.x2 && a.y1 < b.y2;
  // console.log(`overlap( ${JSON.stringify(a)}, ${JSON.stringify(b)}) => ${res}`);
  return res;
}

// rects is a map of {key, {top, left, width, height}}
function coverRegions(rect, rects) {
  if (!rect || !rects) {
    return null;
  }
  let { x1, y1, x2, y2 } = rect;

  for (const [_, value] of rects) {
    let tmp = regionToRect(value);
    if (overlap({ x1, y1, x2, y2 }, tmp)) {
      x1 = min(x1, tmp.x1);
      y1 = min(y1, tmp.y1);
      x2 = max(x2, tmp.x2);
      y2 = max(y2, tmp.y2);
    }
  }

  return { x1, y1, x2, y2 };
}

function createRegion(origin, rect, heights, widths, rects) {
  if (!rect || !rects) {
    return null;
  }
  let x1 = min(rect.x1, rect.x2);
  let y1 = min(rect.y1, rect.y2);
  let x2 = max(rect.x1, rect.x2);
  let y2 = max(rect.y1, rect.y2);
  x1 -= origin.offsetX;
  y1 -= origin.offsetY;
  x2 -= origin.offsetX;
  y2 -= origin.offsetY;

  rect = Object.assign({}, rect, {
    ...coverRegions({ x1, y1, x2, y2 }, rects),
  });

  let c1 = max(binarySearch(widths.length, (i) => widths[i] > rect.x1) - 1, 0);
  let r1 = max(
    binarySearch(heights.length, (i) => heights[i] > rect.y1) - 1,
    0
  );
  let c2 = min(
    binarySearch(widths.length, (i) => widths[i] >= rect.x2),
    widths.length - 1
  );
  let r2 = min(
    binarySearch(heights.length, (i) => heights[i] >= rect.y2),
    heights.length - 1
  );

  return Object.assign({}, rect, { r1, c1, r2: r2 - 1, c2: c2 - 1 });
}

export const useClipRegion = (
  elementRef,
  rowHeights,
  columnWidths,
  rects,
  viewBox
) => {
  const [region, setRegion] = useState(null);

  const onMove = useCallback(
    (rect) => {
      rect = createRegion(viewBox, rect, rowHeights, columnWidths, rects);
      setRegion(rect);
      return rect;
    },
    [setRegion, rects, rowHeights, columnWidths, elementRef, viewBox]
  );

  useEffect(() => {
    let clean = createListeners(elementRef, onMove);
    return () => {
      clean?.();
    };
  }, [elementRef, onMove]);

  return { clipRegion: region };
};

export default useClipRegion;
