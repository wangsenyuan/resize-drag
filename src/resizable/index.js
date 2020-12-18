import React, { useCallback, useMemo, useState } from "react";
import { ResizeContext, RowsContext, ColumnsContext } from "./context";
import ResizableElem from "./elem";
import Background from "./background";
import "./index.scss";

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

const renderBackground = (rows, onChangeRows, cols, onChangeCols) => {
  return (
    <ColumnsContext.Provider value={{ onChangeColumns: onChangeCols }}>
      <RowsContext.Provider value={{ onChangeRows }}>
        <Background rows={rows} cols={cols} />
      </RowsContext.Provider>
    </ColumnsContext.Provider>
  );
};

const ResizableGrid = ({
  className,
  layouts,
  rows,
  cols,
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

  const [rowsState, setRows] = useState(rows);

  const [colsState, setCols] = useState(cols);

  return (
    <div className={`${className} resizable-grid`} style={style} {...rest}>
      {renderBackground(rowsState, setRows, colsState, setCols)}
      {/* {renderChildren(children, layouts, onResize)} */}
    </div>
  );
};

export default ResizableGrid;
