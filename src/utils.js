import { useEffect } from "react";
import randomString from "random-string";

export function max(a, b) {
  if (a >= b) {
    return a;
  }
  return b;
}

export function min(a, b) {
  if (a <= b) {
    return a;
  }
  return b;
}

export const px = (value) => `${value}px`;

export const last = (arr) => {
  if (!arr || arr.length === 0) {
    throw new Error("arr is empty");
  }
  return arr[arr.length - 1];
};

export function binarySearch(n, fn) {
  let left = 0;
  let right = n;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (fn(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return right;
}

export function logWhenChange(label, obj) {
  useEffect(() => {
    console.log(`${label} changed`);
  }, [obj]);
}

export const partialSum = (initValue, nums) => {
  let res = [initValue, ...nums];
  for (let i = 1; i < res.length; i++) {
    res[i] += res[i - 1];
  }
  return res;
};

export const createAction = (type, value) => {
  return { type, value };
};

export const getElementOffset = (elem, level = -1) => {
  let offsetLeft = 0;
  let offsetTop = 0;

  while (elem && level != 0) {
    if (!isNaN(elem.offsetLeft)) {
      offsetLeft += elem.offsetLeft;
    }
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop;
    }
    elem = elem.offsetParent;
    level--;
  }

  return { offsetTop, offsetLeft };
};

export function getAsMapKey(x1, y1, x2, y2) {
  return `${x1}-${y1}-${x2}-${y2}`;
}

export function getViewRect(widths, heights, x1, y1, x2, y2) {
  x1 = max(x1, 1);
  y1 = max(y1, 1);
  x2 = min(x2, widths.length - 1);
  y2 = min(y2, heights.length - 1);
  let offsetY = heights[y1 - 1];
  let offsetX = widths[x1 - 1];
  let height = heights[y2] - offsetY;
  let width = widths[x2] - offsetX;
  return { offsetX, offsetY, width, height };
}

export function getRandomString() {
  return randomString({ length: 20 });
}

export function isEmptyArray(arr) {
  if (!Array.isArray(arr)) {
    return true;
  }
  return arr.length === 0;
}
