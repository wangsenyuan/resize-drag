import React from "react";
import styled from "styled-components";
import FullDiv from "@/components/full-div";

const PaperDiv = styled(FullDiv)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function Page() {
  return (
    <PaperDiv></PaperDiv>
  )
}

export default Page;
