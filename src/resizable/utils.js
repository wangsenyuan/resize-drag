import { useEffect } from "react";

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

export const getElementOffset = (elem) => {
  let offsetLeft = 0;
  let offsetTop = 0;

  while (elem) {
    if (!isNaN(elem.offsetLeft)) {
      offsetLeft += elem.offsetLeft;
    }
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop;
    }
    elem = elem.offsetParent;
  }
  
  return { offsetY: offsetTop, offsetX: offsetLeft };
};
