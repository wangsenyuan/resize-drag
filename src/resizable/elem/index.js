import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { useResize, useViewBox } from "../context";
import { max, px } from "../utils";

function makeResizer(rect, resizerRef, onChange, onResize) {
  if (!resizerRef.current) {
    return;
  }
  console.log("making resizer");
  const element = resizerRef.current;

  element.addEventListener("mousedown", function () {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  });

  function stopResize() {
    onResize(rect.current);
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  }

  function resize(evt) {
    let current = {
      currentX: evt.pageX - evt.target.offsetLeft,
      currentY: evt.pageY - evt.target.offsetTop,
    };

    rect.current = onChange(rect.current, current);
  }
}

function moveTopLeft(rect, current) {
  let { top, left, width, height } = rect;
  let u = left + width;
  let v = top + height;

  let { currentX, currentY } = current;

  let nWidth = max(u - currentX, 30);
  let nHeight = max(v - currentY, 30);

  return { top: currentY, left: currentX, width: nWidth, height: nHeight };
}

function moveBottomLeft(rect, current) {
  let { top, left, width } = rect;
  let u = left + width;

  let { currentX, currentY } = current;

  let nWidth = max(u - currentX, 30);
  let nHeight = max(currentY - top, 30);

  return { top, left: currentX, width: nWidth, height: nHeight };
}

function moveTopRight(rect, current) {
  let { top, left, width, height } = rect;
  let { currentX, currentY } = current;

  let nWidth = max(currentX - left, 30);
  let nHeight = max(top + height - currentY, 30);

  return { top: currentY, left, width: nWidth, height: nHeight };
}

function moveBottomRight(rect, current) {
  let { top, left } = rect;
  let { currentX, currentY } = current;

  let nu = currentX;
  let nv = currentY;

  let nWidth = max(nu - left, 30);
  let nHeight = max(nv - top, 30);

  return { top, left, width: nWidth, height: nHeight };
}

const getRect = (resize) => {
  // console.log("getRect(" + JSON.stringify(resize) + ")");
  const top = resize?.top || 0;
  const left = resize?.left || 0;

  const width = resize?.width || 100;
  const height = resize?.height || 100;
  return { top, left, width, height };
};

const workWithOnResize = (fn, onChange) => {
  return (rect, current) => {
    let res = fn(rect, current);
    onChange(res);
    return res;
  };
};

const wrapByViewBox = (fn, viewBox) => {
  return (rect, current) => {
    let { currentX, currentY } = current;
    currentX -= viewBox.x;
    currentY -= viewBox.y;

    return fn(rect, { currentX, currentY });
  };
};

const Elem = ({ children }) => {
  const { resize, onResize } = useResize();
  const initRect = useRef(getRect(resize));
  const [rect, setRect] = useState(resize);
  const { viewBox } = useViewBox();

  const topLeft = useRef(null);
  const topRight = useRef(null);
  const bottomRight = useRef(null);
  const bottomLeft = useRef(null);

  useEffect(() => {
    makeResizer(
      initRect,
      topLeft,
      workWithOnResize(wrapByViewBox(moveTopLeft, viewBox), setRect),
      onResize
    );
    makeResizer(
      initRect,
      topRight,
      workWithOnResize(wrapByViewBox(moveTopRight, viewBox), setRect),
      onResize
    );
    makeResizer(
      initRect,
      bottomLeft,
      workWithOnResize(wrapByViewBox(moveBottomLeft, viewBox), setRect),
      onResize
    );
    makeResizer(
      initRect,
      bottomRight,
      workWithOnResize(wrapByViewBox(moveBottomRight, viewBox), setRect),
      onResize
    );
  }, [initRect, topLeft, topRight, bottomLeft, bottomLeft, viewBox]);

  return (
    <div
      className={`resizable`}
      style={{
        position: "absolute",
        top: px(rect.top),
        left: px(rect.left),
        width: px(rect.width),
        height: px(rect.height),
      }}
    >
      <div className="resizers">
        <div className="resizer top-left" ref={topLeft}></div>
        <div className="resizer top-right" ref={topRight}></div>
        <div className="resizer bottom-left" ref={bottomLeft}></div>
        <div className="resizer bottom-right" ref={bottomRight}></div>
      </div>
      {children}
    </div>
  );
};

export default Elem;
