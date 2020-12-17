import React, { useCallback, useMemo } from "react";
import { ResizeContext } from "./context";
import ResizableElem from "./elem";

const wrapResizable = (layouts, onResize, children) => {
  return (
    <ResizeContext.Provider
      key={children.key}
      value={{
        resize: layouts[children.key],
        onResize: (layout) => onResize(children.key, layout),
      }}
    >
      <ResizableElem>{children}</ResizableElem>
    </ResizeContext.Provider>
  );
};

const renderChildren = (children, layouts, onResize) => {
  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    return wrapResizable(layouts, onResize, children);
  }

  return children.map((child) => wrapResizable(layouts, onResize, child));
};

const ResizableGrid = ({
  className,
  layouts,
  onLayoutChange,
  children,
  style,
  ...rest
}) => {
  const onResize = useCallback(
    (key, resize) => {
      console.log("get resize => " + JSON.stringify(resize));
      let newLayouts = Object.assign({}, layouts);
      newLayouts[key] = resize;
      onLayoutChange(newLayouts);
      return resize;
    },
    [onLayoutChange, layouts]
  );

  return (
    <div className={`${className} resizable-grid`} style={style} {...rest}>
      {renderChildren(children, layouts, onResize)}
    </div>
  );
};

export default ResizableGrid;
