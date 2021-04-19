import React, { useContext, useReducer } from "react";
import { useMemo } from "react";
// 拖入Editor的组件是atom（通过atomFamily构建），
// 选中id，通过selectorFamily传递给其他组件；
// 拖入的时候直接保存到后端，产生新的id；

function stateReducer(state, { type, value }) {
  return state;
}

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

export function createAction(type, value) {
  return { type, value };
}

export const StateContext = React.createContext({});

export const createPrintState = (initialValue) => {
  const [state, dispatch] = useReducer(
    stateReducer,
    initialValue,
    getInitState
  );

  const value = useMemo(() => {
    return {
      dispatch,
    };
  }, [dispatch]);

  return { state, stateContext: value };
};

export const useStateContext = () => {
  return useContext(StateContext);
};

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
