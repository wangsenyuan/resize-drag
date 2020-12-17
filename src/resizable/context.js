import React, { useContext } from "react";

export const ResizeContext = React.createContext({});

export function useResize() {
  return useContext(ResizeContext)
}

