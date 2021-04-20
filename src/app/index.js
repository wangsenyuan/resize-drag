import React from "react";
import Toolbar from "./toolbar";
import Editor from "./editor";
import ErrorBoundary from "@/components/error-boundary";
import FullDiv from "@/components/full-div";
import { createPrintState, SetStateContext } from "./state";
import styled from "styled-components";
import Sidebar from "./sidebar";

const AppDiv = styled(FullDiv)`
  padding: 10px;

  .toolbar {
    height: 60px;
  }

  .editor-wrapper {
    height: calc(100% - 60px);
  }
`;

const EditorDiv = styled(FullDiv)`
  display: flex;
  .sidebar {
    flex: 0 0 auto;
    width: 100px;
  }

  .editor {
    flex: 1 0 auto;
    width: calc(100% - 100px);
  }
`;

const App = () => {
  const { state, context } = createPrintState();

  return (
    <ErrorBoundary>
      <SetStateContext.Provider value={context}>
        <AppDiv className="main-container">
          <Toolbar className="toolbar" />
          <EditorDiv className="editor-wrapper">
            <Sidebar className="sidebar" />
            <Editor className="editor" state={state} />
          </EditorDiv>
        </AppDiv>
      </SetStateContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
