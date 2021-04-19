import React from "react";
import Layers from "./layers";
import ErrorBoundary from "@/components/error-boundary";
import FullDiv from "@/components/full-div";
import {
  StateContext,
  createViewBox,
  ViewBoxContext,
  createPrintState,
} from "./state";

const App = () => {
  const { state, contextValue } = createPrintState();

  const viewBox = createViewBox(state.rows, state.columns);

  return (
    <ErrorBoundary>
      <StateContext.Provider value={contextValue}>
        <ViewBoxContext.Provider value={viewBox}>
          <FullDiv className="main-container">
            <Layers />
          </FullDiv>
        </ViewBoxContext.Provider>
      </StateContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
