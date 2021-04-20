import React from "react";
import Toolbar from "./toolbar";
import Editor from "./editor";
import ErrorBoundary from "@/components/error-boundary";
import FullDiv from "@/components/full-div";
import { createPrintState, SetStateContext } from "./state";

const App = () => {
  const { state, context } = createPrintState();

  return (
    <ErrorBoundary>
      <SetStateContext.Provider value={context}>
        <FullDiv className="main-container">
          <Toolbar className="header" />
          <Editor className="editor" state={state} />
        </FullDiv>
      </SetStateContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
