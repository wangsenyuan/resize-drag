import React from "react";
import styled from "styled-components";
import FullDiv from "@/components/full-div";
import { useGetStateContext } from "../../../state";
import Control from "./controls";

const PaperDiv = styled(FullDiv)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function Page() {
  const printObjectState = useGetStateContext();

  return (
    <PaperDiv>
      <Control control={printObjectState.container} />
    </PaperDiv>
  );
}

export default Page;
