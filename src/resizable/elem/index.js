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

  function startResize() {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
  }

  element.addEventListener("mousedown", startResize);

  function stopResize() {
    let res = onResize(rect.current);
    onChange(res);
    rect.current = res;
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
  }

  function resize(evt) {
    let current = {
      currentX: evt.pageX,
      currentY: evt.pageY,
    };

    rect.current = onChange(rect.current, current);
  }

  return () => {
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
    element.removeEventListener("mousedown", startResize);
  };
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

const workWithOnChange = (fn, onChange) => {
  return (rect, current) => {
    if (current) {
      rect = fn(rect, current);
    }
    onChange(rect);
    return rect;
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
    let clean1 = makeResizer(
      initRect,
      topLeft,
      workWithOnChange(wrapByViewBox(moveTopLeft, viewBox), setRect),
      onResize
    );
    let clean2 = makeResizer(
      initRect,
      topRight,
      workWithOnChange(wrapByViewBox(moveTopRight, viewBox), setRect),
      onResize
    );
    let clean3 = makeResizer(
      initRect,
      bottomLeft,
      workWithOnChange(wrapByViewBox(moveBottomLeft, viewBox), setRect),
      onResize
    );
    let clean4 = makeResizer(
      initRect,
      bottomRight,
      workWithOnChange(wrapByViewBox(moveBottomRight, viewBox), setRect),
      onResize
    );
    return () => {
      clean1();
      clean2();
      clean3();
      clean4();
    };
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
        {children}
      </div>
    </div>
  );
};

export default Elem;
