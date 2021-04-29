import React, { useMemo, useContext, useState } from "react";
export const AuxiliaryLine = React.createContext({});
export const SetAuxiliaryLine = React.createContext({});
import { partialSum, last, getViewRect, px } from "@/utils";

export const createAuxiliaryLineContext = () => {
  const [state, setState] = useState({
    dir: AuxliiaryLineDirs.none,
    position: -1,
  });

  const value = useMemo(() => {
    return {
      set: (dir, position) => {
        setState({ dir, position });
      },
    };
  }, [setState]);

  return { state, context: value };
};

export const useSetAuxiliaryLine = () => useContext(SetAuxiliaryLine);
export const useGetAuxiliaryLine = () => useContext(AuxiliaryLine);

export const ViewBoxContext = React.createContext({});

export function createViewBox(rows, columns) {
  const viewBox = useMemo(() => {
    let widths = partialSum(0, columns);
    let heights = partialSum(0, rows);
    let width = last(widths);
    let height = last(heights);
    return { width, height, rows, columns, widths, heights };
  }, [rows, columns]);

  return viewBox;
}

export const useViewBox = () => {
  return useContext(ViewBoxContext);
};

export const AuxliiaryLineDirs = {
  horizontal: 0,
  vertical: 1,
  none: -1,
};

export const WorkspaceContext = React.createContext({});

export const useWorkspace = () => useContext(WorkspaceContext);
