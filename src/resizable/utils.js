export function max(a, b) {
  if (a >= b) {
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
