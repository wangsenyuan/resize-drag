import React, { useEffect, useRef } from "react";
import Grid from "./grid";
import Paper from "./paper";
import styled from "styled-components";
import FullDiv from "@/components/full-div";
import { useViewBox } from "../../state";
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

  return (
    <LayersPage className={`${className ?? ""}`} ref={layersRef}>
      <div
        className="layers"
        style={{ width: px(viewBox.width), height: px(viewBox.height) }}
      >
        <Grid />
        <Paper />
      </div>
    </LayersPage>
  );
}

export default Layers;
