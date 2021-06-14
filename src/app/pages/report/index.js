import React, { useCallback, useReducer, useState } from "react";
import styled from "styled-components";
import Filters from "./filters";
import Content from "./content";

const ReportDiv = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`;

function Report() {
  const [filters, setFilters] = useState({});

  return (
    <ReportDiv className="report-wrapper">
      <Filters form={filters} onChange={setFilters} />
      <Content form={filters} />
    </ReportDiv>
  );
}

export default Report;
