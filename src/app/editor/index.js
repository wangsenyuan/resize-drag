import React, { useRef, useState, useEffect, useCallback } from "react";

import Workspace from "./workspace";
import FullDiv from "@/components/full-div";
import {
  createViewBox,
  ViewBoxContext,
  AuxiliaryLine,
  SetAuxiliaryLine,
  createAuxiliaryLineContext,
  WorkspaceContext,
} from "./editor-context";

import Columns from "./column-numbers";
import Rows from "./row-numbers";
import { EditorDiv, Header, TopLeft, Content } from "./components";

import AuxiliaryLinePage from "./auxiliary-lines";

import { useGetStateContext } from "@app/state";

function createWorkspace() {
  const workspaceRef = useRef();

  const [initialOffset, setInitialOffset] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (workspaceRef?.current) {
      let rect = workspaceRef.current.getBoundingClientRect();
      console.log(`workspace rect is ${JSON.stringify(rect)}`);
      setInitialOffset({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [workspaceRef.current, setInitialOffset]);

  /**
   * this method is used to get the coordinates (x, y) regarding to the editor workspace
   */
  const getWorkspaceCoords = useCallback(
    (x, y) => {
      if (!workspaceRef.current) {
        return { x, y };
      }
      let rect = workspaceRef.current.getBoundingClientRect();
      let offsetX = initialOffset.left - rect.left;
      let offsetY = initialOffset.top - rect.top;
      return { x: x + offsetX, y: y + offsetY };
    },
    [workspaceRef.current, initialOffset]
  );

  const withIn = useCallback(
    (x, y) => {
      let { top, left, width, height } = initialOffset;
      return x >= left && x <= left + width && y >= top && y <= left + height;
    },
    [initialOffset]
  );

  return [workspaceRef, { getWorkspaceCoords, offset: initialOffset, withIn }];
}

function Editor({ className }) {
  const state = useGetStateContext();
  const { layout } = state;
  const viewBox = createViewBox(layout.rows, layout.columns);
  const auxiliaryLine = createAuxiliaryLineContext();

  const [workspaceRef, workspaceContext] = createWorkspace();

  return (
    <ViewBoxContext.Provider value={viewBox}>
      <AuxiliaryLine.Provider value={auxiliaryLine.state}>
        <SetAuxiliaryLine.Provider value={auxiliaryLine.context}>
          <WorkspaceContext.Provider value={workspaceContext}>
            <EditorDiv className={`${className ?? ""} editor `}>
              <AuxiliaryLinePage className="auxiliary-line-wraper" />
              <Header className="header-wraper">
                <TopLeft />
                <Columns columns={layout.columns} className="header-columns" />
              </Header>
              <Content className="content-wraper">
                <Rows rows={layout.rows} className="row-numbers" />
                <Workspace className="content" ref={workspaceRef} />
              </Content>
            </EditorDiv>
          </WorkspaceContext.Provider>
        </SetAuxiliaryLine.Provider>
      </AuxiliaryLine.Provider>
    </ViewBoxContext.Provider>
  );
}

export default Editor;
