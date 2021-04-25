import React, { useEffect, useRef, useState } from "react";

import FullDiv from "@/components/full-div";
import styled from "styled-components";
import { AuxliiaryLineDirs, useGetAuxiliaryLine } from "../editor-context";
import { getElementOffset } from "@/utils";

const PageDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

function AuxiliaryLine({ line, offset }) {
  if (line.dir === AuxliiaryLineDirs.vertical) {
    return (
      <line
        x1={`${line.position - offset.offsetLeft}`}
        x2={`${line.position - offset.offsetLeft}`}
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
        y1={`${line.position - offset.offsetTop}`}
        y2={`${line.position - offset.offsetTop}`}
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
  const ref = useRef(null);
  const [offset, setOffset] = useState({ offsetTop: 0, offsetLeft: 0 });

  useEffect(() => {
    if (ref.current) {
      let offset = getElementOffset(ref.current);
      setOffset(offset);
    }
  }, [setOffset, ref.current]);

  return (
    <PageDiv className={className}>
      <FullDiv ref={ref}>
        <svg
          width={"100%"}
          height={"100%"}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <AuxiliaryLine line={auxiliaryLine} offset={offset} />
        </svg>
      </FullDiv>
    </PageDiv>
  );
}

export default Page;
