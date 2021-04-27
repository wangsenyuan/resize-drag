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
  layout: {
    rows: Array(100).fill(26),
    columns: Array(26).fill(100),
  },
  filled: new Map(),
  container: {
    key: "root",
    type: CONTROLE_TYPES.CONTAINER,
    properties: {
      x1: 0,
      y1: 0,
      x2: 26,
      y2: 100,
    },
    children: [],
  },
};
// children are also controls,

function getInitState(init) {
  if (!init) {
    return initState;
  }
  return Object.assign({}, initState, init);
}

function changeColumnWidth(state, { index, value }) {
  let { layout } = state;
  let { columns } = layout;
  columns = [...columns.slice(0, index), value, ...columns.slice(index + 1)];
  return Object.assign({}, state, {
    layout: Object.assign({}, layout, { columns }),
  });
}

function changeRowHeight(state, { index, value }) {
  let { layout } = state;
  let { rows } = layout;
  rows = [...rows.slice(0, index), value, ...rows.slice(index + 1)];
  layout = Object.assign({}, layout, { rows });
  return Object.assign({}, state, { layout });
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

export const SetStateContext = React.createContext({});

export const useSetStateContext = () => {
  return useContext(SetStateContext);
};
