import React from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
    box-shadow: 0 0px 1px #333;
  }

  .editor {
    flex: 1 0 auto;
    width: calc(100% - 100px);
  }
`;

const App = () => {
  const { state, context } = createPrintState();
  console.log(state)
  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <SetStateContext.Provider value={context}>
          <AppDiv className="main-container">
            <Toolbar className="toolbar" />
            <EditorDiv className="editor-wrapper">
              <Sidebar className="sidebar" />
              <Editor className="editor" state={state} />
            </EditorDiv>
          </AppDiv>
        </SetStateContext.Provider>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default App;
