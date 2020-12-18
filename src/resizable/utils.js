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
