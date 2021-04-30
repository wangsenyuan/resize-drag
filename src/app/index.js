import React, { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDragDropManager } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Toolbar from "./toolbar";
import Editor from "./editor";
import ErrorBoundary from "@/components/error-boundary";
import FullDiv from "@/components/full-div";
import { createPrintState, SetStateContext, GetStateContext } from "./state";
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
    width: 200px;
    box-shadow: 0 0px 1px #333;
  }

  .editor {
    flex: 1 0 auto;
    width: calc(100% - 200px);
  }
`;

function EditorWrapper() {
  return (
    <EditorDiv className={`editor-wrapper`}>
      <Sidebar className="sidebar" />
      <Editor className="editor" />
    </EditorDiv>
  );
}

const App = () => {
  const { state, context } = createPrintState();

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <GetStateContext.Provider value={state}>
          <SetStateContext.Provider value={context}>
            <AppDiv className="main-container">
              <Toolbar className="toolbar" />
              <EditorWrapper />
            </AppDiv>
          </SetStateContext.Provider>
        </GetStateContext.Provider>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default App;
