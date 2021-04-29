import React, { useEffect, useRef } from "react";
import Grid from "./grid";
import Paper from "./paper";
import styled from "styled-components";
import FullDiv from "@/components/full-div";
import { useViewBox } from "../editor-context";
import { px } from "@/utils";
import { scrollEditor } from "../events";
import Preview from "./preview";

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

function Workspace({ className }, divRef) {
  const viewBox = useViewBox();
  const layersRef = useRef(null);

  useEffect(() => {
    function setPosition(evt) {
      let scrollTop = layersRef.current.scrollTop;
      let scrollLeft = layersRef.current.scrollLeft;
      scrollEditor({ scrollTop, scrollLeft });
    }

    if (layersRef.current) {
      layersRef.current.onscroll = setPosition;
    }
  }, [layersRef]);

  return (
    <LayersPage className={`${className ?? ""}`} ref={layersRef}>
      <div
        ref={divRef}
        className="layers"
        style={{ width: px(viewBox.width), height: px(viewBox.height) }}
      >
        <Grid />
        <Paper />
        <Preview />
      </div>
    </LayersPage>
  );
}

export default React.forwardRef(Workspace);
