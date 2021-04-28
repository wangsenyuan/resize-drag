import React from "react";

import Layers from "./layers";
import FullDiv from "@/components/full-div";
import {
  createViewBox,
  ViewBoxContext,
  AuxiliaryLine,
  SetAuxiliaryLine,
  createAuxiliaryLineContext,
} from "./editor-context";

import Columns from "./column-numbers";
import Rows from "./row-numbers";
import styled from "styled-components";

import AuxiliaryLinePage from "./auxiliary-lines";

import Dustbin from "../dragBox/targetBox";
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

  return (
    <ViewBoxContext.Provider value={viewBox}>
      <AuxiliaryLine.Provider value={auxiliaryLine.state}>
        <SetAuxiliaryLine.Provider value={auxiliaryLine.context}>
          <EditorDiv className={`${className ?? ""} editor `}>
            <AuxiliaryLinePage className="auxiliary-line-wraper" />
            <Header className="header-wraper">
              <TopLeft />
              <Columns columns={layout.columns} className="header-columns" />
            </Header>
            <Content className="content-wraper">
              <Rows rows={layout.rows} className="row-numbers" />
              <Layers className="content" />
            </Content>
          </EditorDiv>
        </SetAuxiliaryLine.Provider>
      </AuxiliaryLine.Provider>
    </ViewBoxContext.Provider>
  );
}

export default Editor;
