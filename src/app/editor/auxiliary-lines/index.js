import React from "react";

import FullDiv from "@/components/full-div";
import styled from "styled-components";
import { AuxliiaryLineDirs, useGetAuxiliaryLine } from "../../state";

const PageDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function AuxiliaryLine({ line }) {
  if (line.dir === AuxliiaryLineDirs.vertical) {
    return (
      <line
        x1={`${line.position}`}
        x2={`${line.position}`}
        y1={"0"}
        y2={`2000px`}
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1"
      />
    );
  } else if (line.dir === AuxliiaryLineDirs.horizontal) {
    return (
      <line
        x1={`0`}
        x2={`2000px`}
        y1={`${line.position}`}
        y2={`${line.position}`}
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1"
      />
    );
  }

  return null;
}

function Page({ className }) {
  const auxiliaryLine = useGetAuxiliaryLine();

  return (
    <PageDiv className={className}>
      <FullDiv>
        <svg
          width={"100%"}
          height={"100%"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 100% 100%`}
        >
          <AuxiliaryLine line={auxiliaryLine} />
        </svg>
      </FullDiv>
    </PageDiv>
  );
}

export default Page;
