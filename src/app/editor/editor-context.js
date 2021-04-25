import React, { useMemo, useContext, useState } from "react";
export const AuxiliaryLine = React.createContext({});
export const SetAuxiliaryLine = React.createContext({});

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
    let width = columns.reduce((a, b) => a + b, 0);
    let height = rows.reduce((a, b) => a + b, 0);
    return { width, height, rows, columns };
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
