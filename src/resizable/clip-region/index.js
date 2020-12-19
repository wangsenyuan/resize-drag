import { useCallback, useEffect, useMemo, useState } from "react";
import { binarySearch, max, min } from "../utils";

function createListeners(elementRef, onRect, onMove) {
  if (!elementRef.current) {
    return;
  }

  let element = elementRef.current;
  let rect = null;
  function start(evt) {
    onRect(null);
    rect = { x1: 0, y1: 0, x2: 0, y2: 0 };
    rect.x1 = Math.floor(evt.pageX);
    rect.y1 = Math.floor(evt.pageY);
    // console.log(`when starting clicking => ` + JSON.stringify(rect));
    // console.log("start drawing rect (" + x1 + ", " + y1 + ")");
    element.addEventListener("mousemove", move);
    element.addEventListener("mouseup", stop);
  }

  function move(evt) {
    if (!rect) {
      return;
    }
    rect.x2 = Math.floor(evt.pageX);
    rect.y2 = Math.floor(evt.pageY);
    onMove(rect);
    // console.log("after move (" + JSON.stringify(rect) + ")");
  }

  function cleanListeners() {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mousedown", start);
  }

  function stop(evt) {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    if (!rect) {
      return;
    }
    rect.x2 = Math.floor(evt.pageX);
    rect.y2 = Math.floor(evt.pageY);
    onRect(rect);
    onMove(null);
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
function coverRegions(origin, rect, rects) {
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

  rect = coverRegions(origin, { x1, y1, x2, y2 }, rects);

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

  return {
    r1,
    c1,
    r2,
    c2,
    x1: widths[c1] + origin.offsetX,
    y1: heights[r1] + origin.offsetY,
    x2: widths[c2] + origin.offsetX,
    y2: heights[r2] + origin.offsetY,
  };
}

function getOrigin(elementRef) {
  let element = elementRef.current;
  let offsetX = Math.floor(element.getBoundingClientRect().left);
  let offsetY = Math.floor(element.getBoundingClientRect().top);
  return { offsetX, offsetY };
}

export const useClipRegion = (elementRef, rowHeights, columnWidths, rects) => {
  const [region, setRegion] = useState(null);
  const [virtualRect, setVirtualRect] = useState(null);

  const onRect = useCallback(
    (rect) => {
      let origin = getOrigin(elementRef);
      rect = createRegion(origin, rect, rowHeights, columnWidths, rects);
      setRegion(rect);
      return rect;
    },
    [rowHeights, columnWidths, setRegion, rects, elementRef]
  );

  const onMove = useCallback(
    (rect) => {
      let origin = getOrigin(elementRef);
      rect = createRegion(origin, rect, rowHeights, columnWidths, rects);
      setVirtualRect(rect);
      return rect;
    },
    [setVirtualRect, rects, origin, rowHeights, columnWidths, elementRef]
  );

  useEffect(() => {
    let clean = createListeners(elementRef, onRect, onMove);
    return () => {
      clean?.();
    };
  }, [elementRef, onRect, onMove]);

  return { clipRegion: region, virtualRect };
};

export default useClipRegion;
