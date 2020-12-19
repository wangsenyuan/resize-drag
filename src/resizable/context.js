import React, { useContext } from "react";

export const SvgMovingContext = React.createContext({});

export function useSvgMoving() {
  return useContext(SvgMovingContext);
}

export const ViewBoxContext = React.createContext({});

export function useViewBox() {
  return useContext(ViewBoxContext);
}

export const ClipContext = React.createContext({});

export function useClipContext() {
  return useContext(ClipContext);
}
