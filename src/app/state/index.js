import React, { useContext, useReducer, useState } from "react";
import { useMemo } from "react";
// 拖入Editor的组件是atom（通过atomFamily构建），
// 选中id，通过selectorFamily传递给其他组件；
// 拖入的时候直接保存到后端，产生新的id；

export const CONTROLE_TYPES = {
  CONTAINER: "container",
  FIELD: "field",
  LABEL: "label",
};

const initState = {
  key: "root",
  type: CONTROLE_TYPES.CONTAINER,
  rows: Array(100).fill(60),
  columns: Array(26).fill(100),
  properties: {
    x: 0,
    y: 0,
    w: 26,
    h: 100,
  },
  children: [],
};
// children are also controls,

function getInitState(init) {
  if (!init) {
    return initState;
  }
  return Object.assign({}, initState, init);
}

function changeColumnWidth(state, { index, value }) {
  let { columns } = state;
  columns = [...columns.slice(0, index), value, ...columns.slice(index + 1)];
  return Object.assign({}, state, { columns });
}

function changeRowHeight(state, { index, value }) {
  let { rows } = state;
  rows = [...rows.slice(0, index), value, ...rows.slice(index + 1)];
  return Object.assign({}, state, { rows });
}

function stateReducer(state, { type, value }) {
  switch (type) {
    case STATE_ACTIONS.CHANGE_WIDTH:
      return changeColumnWidth(state, value);
    case STATE_ACTIONS.CHANGE_HEIGHT:
      return changeRowHeight(state, value);
  }
  return state;
}

export const STATE_ACTIONS = {
  CHANGE_WIDTH: 0,
  CHANGE_HEIGHT: 1,
};

export function createAction(type, value) {
  return { type, value };
}

export const SetStateContext = React.createContext({});

export const createPrintState = (initialValue) => {
  const [state, dispatch] = useReducer(
    stateReducer,
    initialValue,
    getInitState
  );

  const value = useMemo(() => {
    return {
      changeWidth: (index, value) =>
        dispatch({ type: STATE_ACTIONS.CHANGE_WIDTH, value: { index, value } }),
      changeHeight: (index, value) =>
        dispatch({
          type: STATE_ACTIONS.CHANGE_HEIGHT,
          value: { index, value },
        }),
    };
  }, [dispatch]);

  return { state, context: value };
};

export const useSetStateContext = () => {
  return useContext(SetStateContext);
};

export const AuxliiaryLineDirs = {
  horizontal: 0,
  vertical: 1,
  none: -1,
};

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
        console.log(`will set auxiliary line ${dir} ${position}`);
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
