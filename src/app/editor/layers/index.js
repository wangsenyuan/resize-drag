import React from "react";
import Grid from "./grid";
import Paper from "./paper";
import styled from "styled-components";
import FullDiv from "@/components/full-div";

const LayersPage = styled(FullDiv)`
  position: relative;
`;

function Layers() {
  return (
    <LayersPage className="layers">
      <Grid />
      <Paper />
    </LayersPage>
  );
}

export default Layers;
