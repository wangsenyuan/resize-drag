import React, { useCallback, useEffect, useRef, useState } from "react";
import Grid from "./grid";
import Paper from "./paper";
import styled from "styled-components";
import FullDiv from "@/components/full-div";
import { useViewBox, GetEditorOffsetContext } from "../editor-context";
import { px } from "@/utils";
import { scrollEditor } from "../events";

const LayersPage = styled(FullDiv)`
  overflow: auto;
  position: relative;
  .layers {
    position: relative;
    > * {
      overflow: hidden;
    }
  }
`;

function Layers({ className }) {
  const viewBox = useViewBox();
  const layersRef = useRef(null);

  useEffect(() => {
    function setPosition(evt) {
      let scrollTop = layersRef.current.scrollTop;
      let scrollLeft = layersRef.current.scrollLeft;
      // console.log(`scroll ${scrollTop} ${scrollLeft}`);
      scrollEditor({ scrollTop, scrollLeft });
    }

    if (layersRef.current) {
      layersRef.current.onscroll = setPosition;
    }
  }, [layersRef]);

  const divRef = useRef(null);

  const [initialOffset, setInitialOffset] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (divRef.current) {
      let rect = divRef.current.getBoundingClientRect();
      setInitialOffset({ top: rect.top, left: rect.left });
    }
  }, [divRef.current, setInitialOffset]);

  /**
   * this method is used to get the coordinates (x, y) regarding to the editor workspace
   */
  const getEditorOffset = useCallback(
    (x, y) => {
      if (!divRef.current) {
        return { x, y };
      }
      let rect = divRef.current.getBoundingClientRect();
      let offsetX = initialOffset.left - rect.left;
      let offsetY = initialOffset.top - rect.top;
      return { x: x + offsetX, y: y + offsetY };
    },
    [divRef.current, initialOffset]
  );

  return (
    <LayersPage className={`${className ?? ""}`} ref={layersRef}>
      <GetEditorOffsetContext.Provider value={getEditorOffset}>
        <div
          ref={divRef}
          className="layers"
          style={{ width: px(viewBox.width), height: px(viewBox.height) }}
        >
          <Grid />
          <Paper />
        </div>
      </GetEditorOffsetContext.Provider>
    </LayersPage>
  );
}

export default Layers;
