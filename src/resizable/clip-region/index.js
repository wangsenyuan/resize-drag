import { useCallback, useEffect, useMemo, useState } from "react";
import { binarySearch, max, min } from "../utils";

function createListeners(elementRef, onRect, onMove) {
  if (!elementRef.current) {
    return;
  }

  let element = elementRef.current;
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;
  function start(evt) {
    onRect(null);
    x1 = Math.floor(evt.pageX);
    y1 = Math.floor(evt.pageY);
    element.addEventListener("mousemove", move);
    element.addEventListener("mouseup", stop);
  }

  function move(evt) {
    x2 = Math.floor(evt.pageX);
    y2 = Math.floor(evt.pageY);
    onMove({
      x1: min(x1, x2),
      y1: min(y1, y2),
      x2: max(x1, x2),
      y2: max(y1, y2),
    });
  }

  function cleanListeners() {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mousedown", start);
  }

  function stop() {
    element.removeEventListener("mouseup", stop);
    element.removeEventListener("mousemove", move);
    onRect({
      x1: min(x1, x2),
      y1: min(y1, y2),
      x2: max(x1, x2),
      y2: max(y1, y2),
    });
    onMove(null);
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

  return res;
}

// rects is a map of {key, {top, left, width, height}}
function coverRegions(origin, rect, rects) {
  if (!rect || !rects) {
    return null;
  }
  let { x1, y1, x2, y2 } = rect;
  x1 -= origin.offsetX;
  y1 -= origin.offsetY;
  x2 -= origin.offsetX;
  y2 -= origin.offsetY;

  for (const [_, value] of rects) {
    let tmp = regionToRect(value);
    if (overlap({ x1, y1, x2, y2 }, tmp)) {
      x1 = min(x1, tmp.x1);
      y1 = min(y1, tmp.y1);
      x2 = max(x2, tmp.x2);
      y2 = max(y2, tmp.y2);
    }
  }
  x1 += origin.offsetX;
  y1 += origin.offsetY;
  x2 += origin.offsetX;
  y2 += origin.offsetY;
  return { x1, y1, x2, y2 };
}

function createRegion(origin, rect, heights, widths, rects) {
  if (!rect || !rects) {
    return null;
  }
  const { x1, y1, x2, y2 } = coverRegions(origin, rect, rects);
  let c1 = binarySearch(widths.length, (i) => widths[i] >= x1);
  let r1 = binarySearch(heights.length, (i) => heights[i] >= y1);
  let c2 = binarySearch(widths.length, (i) => widths[i] > x2);
  let r2 = binarySearch(heights.length, (i) => heights[i] > y2);
  return { r1, c1, r2, c2 };
}

function getOrigin(elementRef) {
  let element = elementRef.current;
  let offsetX = element.getBoundingClientRect().left;
  let offsetY = element.getBoundingClientRect().top;
  return { offsetX, offsetY };
}

export const useClipRegion = (elementRef, rowHeights, columnWidths, rects) => {
  const [region, setRegion] = useState(null);
  const [virtualRect, setVirtualRect] = useState(null);

  const onRect = useCallback(
    (rect) => {
      let origin = getOrigin(elementRef);
      setRegion(createRegion(origin, rect, rowHeights, columnWidths, rects));
    },
    [rowHeights, columnWidths, setRegion, rects, elementRef]
  );

  const onMove = useCallback(
    (rect) => {
      let origin = getOrigin(elementRef);
      setVirtualRect(coverRegions(origin, rect, rects));
    },
    [setVirtualRect, rects, origin]
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
