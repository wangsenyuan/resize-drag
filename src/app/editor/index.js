import React from "react";

import Layers from "./layers";
import FullDiv from "@/components/full-div";
import {
  createViewBox,
  ViewBoxContext,
  AuxiliaryLine,
  SetAuxiliaryLine,
  createAuxiliaryLineContext,
} from "../state";
import Columns from "./column-numbers";

function Editor({ className, state }) {
  const viewBox = createViewBox(state.rows, state.columns);
  const auxiliaryLine = createAuxiliaryLineContext();
  return (
    <ViewBoxContext.Provider value={viewBox}>
      <AuxiliaryLine.Provider value={auxiliaryLine.state}>
        <SetAuxiliaryLine.Provider value={auxiliaryLine.context}>
          <FullDiv className={`${className ?? ""} editor `}>
            <Columns columns={state.columns} className="header" />
            <div className="layers-wrapper">
              <Layers />
            </div>
          </FullDiv>
        </SetAuxiliaryLine.Provider>
      </AuxiliaryLine.Provider>
    </ViewBoxContext.Provider>
  );
}

export default Editor;
