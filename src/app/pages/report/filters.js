import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import Select from "@/components/select";
import DateInput from "@/components/date-input";
const FilterDiv = styled.div`
  width: 100%;

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    & > * {
      flex: 0 0 25%;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
`;

const envs = [
  { value: "DEV", label: "DEV" },
  { value: "UAT", label: "UAT" },
  { value: "PROD", label: "PROD" },
];

const apps = [{ value: "test", label: "TEST" }];

const checkTypes = [{ value: "test", label: "TEST" }];

const failReasons = [{ value: "unknown", label: "UNKNOWN" }];

function getInitFilter(form) {
  if (!form) {
    return { env: "DEV", app: "test" };
  }
  return Object.assign({}, form);
}

function filterReducer(state, { key, value }) {
  let newState = Object.assign({}, state);
  newState[key] = value;

  return newState;
}

function wrapDispatch(dispatch, key) {
  return useCallback(
    (e) => {
      dispatch({ key, value: e.target.value });
    },
    [dispatch]
  );
}

function Filters({ form, onChange }) {
  const [state, dispatch] = useReducer(filterReducer, form, getInitFilter);

  const onChangeEnv = wrapDispatch(dispatch, "env");

  const onChangeApp = wrapDispatch(dispatch, "app");

  const onChangeCheckType = wrapDispatch(dispatch, "checkType");

  const onChangeFailReason = wrapDispatch(dispatch, "failReason");

  const onChangeStart = wrapDispatch(dispatch, "start");

  const onChangeEnd = wrapDispatch(dispatch, "end");

  const onOk = useCallback(() => {
    onChange?.(state);
  }, [onChange, state]);

  return (
    <FilterDiv className="filters-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <Select
          options={envs}
          value={state.env}
          onChange={onChangeEnv}
          label="ENV"
        />
        <Select
          options={apps}
          value={state.app}
          onChange={onChangeApp}
          label={"APP"}
        />
        <Select
          options={checkTypes}
          value={state.checkType}
          onChange={onChangeCheckType}
          label={"CHECK TYPE"}
        />
        <Select
          options={failReasons}
          value={state.failReason}
          onChange={onChangeFailReason}
          label={"Fail Reason"}
        />
        <DateInput value={state.start} label="Start" onChange={onChangeStart} />
        <DateInput value={state.end} label="End" onChange={onChangeEnd} />
        <button onClick={onOk}>确定</button>
      </form>
    </FilterDiv>
  );
}

export default Filters;
