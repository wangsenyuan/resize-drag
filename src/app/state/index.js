import React, { useContext, useReducer, useState } from "react";
import { useMemo } from "react";
// 拖入Editor的组件是atom（通过atomFamily构建），
// 选中id，通过selectorFamily传递给其他组件；
// 拖入的时候直接保存到后端，产生新的id；

export const ControlTypes = {
  CONTAINER: "container",
  FIELD: "field",
  LABEL: "label",
};

const initState = {
  layout: {
    rows: Array(100).fill(30),
    columns: Array(26).fill(100),
  },
  filled: new Map(),
  container: {
    defKey: "root",
    type: ControlTypes.CONTAINER,
    properties: {
      x1: 0,
      y1: 0,
      x2: 26,
      y2: 100,
    },
    children: [
      {
        defKey: "a",
        type: ControlTypes.CONTAINER,
        properties: { x1: 1, y1: 2, x2: 10, y2: 10, backgroundColor: "yellow" },
        children: [
          {
            defKey: "a1",
            type: ControlTypes.LABEL,
            label: "标签",
            properties: {
              x1: 2,
              y1: 3,
              x2: 4,
              y2: 3,
            },
          },
          {
            defKey: "a2",
            type: ControlTypes.CONTAINER,
            properties: {
              x1: 6,
              y1: 4,
              x2: 9,
              y2: 7,
              backgroundColor: "red",
            },
            children: [
              {
                defKey: "a21",
                type: ControlTypes.LABEL,
                label: "标签a21",
                properties: {
                  x1: 6,
                  y1: 4,
                  x2: 6,
                  y2: 5,
                },
              },
              {
                defKey: "a22",
                type: ControlTypes.LABEL,
                label: "标签a22",
                properties: {
                  x1: 9,
                  y1: 7,
                  x2: 9,
                  y2: 7,
                },
              },
            ],
          },
        ],
      },
      {
        defKey: "b",
        type: ControlTypes.LABEL,
        label: "这是一个label",
        properties: { x1: 2, y1: 12, x2: 10, y2: 12, backgroundColor: "green" },
      },
    ],
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

export const GetStateContext = React.createContext({});

export const useGetStateContext = () => {
  return useContext(GetStateContext);
};
