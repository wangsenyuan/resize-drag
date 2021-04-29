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
import styled from "styled-components";

import AuxiliaryLinePage from "./auxiliary-lines";

import { useGetStateContext } from "../state";

const row_number_width = 50;
const col_number_height = 40;

const EditorDiv = styled(FullDiv)`
  position: relative;
  .header-wraper {
    width: 100%;
    height: ${col_number_height}px;
  }

  .content-wraper {
    width: 100%;
    height: calc(100% - ${col_number_height}px);
  }

  .auxiliary-line-wraper {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  .row-numbers {
    width: ${row_number_width}px;
    flex: 0 0 auto;
    height: 100%;
    padding-bottom: 20px;
  }

  .content {
    flex: 1 0 auto;
    height: 100%;
    width: calc(100% - ${row_number_width}px);
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  padding-right: 20px;
  .header-columns {
    flex: 1 0 auto;
    width: calc(100% - ${row_number_width}px);
    overflow: hidden;
  }
`;

const TopLeft = styled.div`
  width: ${row_number_width}px;
  flex: 0 0 auto;
  border: 1px solid black;
`;

function Editor({ className }) {
  const state = useGetStateContext();
  const { layout } = state;
  const viewBox = createViewBox(layout.rows, layout.columns);
  const auxiliaryLine = createAuxiliaryLineContext();

  const workspaceRef = useRef();

  const [initialOffset, setInitialOffset] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (workspaceRef?.current) {
      let rect = workspaceRef.current.getBoundingClientRect();
      setInitialOffset({ top: rect.top, left: rect.left });
    }
  }, [workspaceRef.current, setInitialOffset]);

  /**
   * this method is used to get the coordinates (x, y) regarding to the editor workspace
   */
  const getWorkspaceCoord = useCallback(
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

  return (
    <ViewBoxContext.Provider value={viewBox}>
      <AuxiliaryLine.Provider value={auxiliaryLine.state}>
        <SetAuxiliaryLine.Provider value={auxiliaryLine.context}>
          <WorkspaceContext.Provider
            value={{ getWorkspaceCoord, offset: initialOffset }}
          >
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
