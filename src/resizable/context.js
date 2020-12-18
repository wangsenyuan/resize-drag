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

export const ViewBoxContext = React.createContext({});

export function useViewBox() {
  return useContext(ViewBoxContext);
}

export const CollisionContext = React.createContext({});

export function useCollision() {
  return useContext(CollisionContext);
}

export const DropAreaContext = React.createContext({});

export function useDropArea() {
  return useContext(DropAreaContext);
}
