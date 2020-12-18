import React, { useContext } from "react";

export const ResizeContext = React.createContext({});

export function useResize() {
  return useContext(ResizeContext);
}

export const RowsContext = React.createContext({});

export function useRows() {
  return useContext(RowsContext);
}

export const ColumnsContext = React.createContext({});

export function useColumns() {
  return useContext(ColumnsContext);
}

export const SvgMovingContext = React.createContext({});

export function useSvgMoving() {
  return useContext(SvgMovingContext);
}
