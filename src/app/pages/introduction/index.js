import React, { useEffect, useState } from "react";
import styled from "styled-components";

import FullDiv from "@/components/full-div";
import StyledTable from "@/components/styled-table";

const Div = styled(FullDiv)``;

const headers = [
  "Env",
  "App",
  "Check Scope",
  "Current Status",
  "Schedule Time",
  "Last Check Time(EST)",
  "Next Check Time(EST)",
];

function mockData() {
  return [
    {
      id: "1",
      env: "test",
      app: "mock",
      scope: "dev",
      currentStatus: "active",
    },
    {
      id: "2",
      env: "test",
      app: "mock",
      scope: "dev",
      currentStatus: "active",
    },
  ];
}

async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData()), 1000);
  });
}

function renderData(data) {
  return data.map((item) => (
    <tr key={item.id}>
      <td>{item.env}</td>
      <td>{item.app}</td>
      <td>{item.scope}</td>
      <td>{item.currentStatus}</td>
    </tr>
  ));
}

function Introduction() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(setData);
  }, [setData]);

  return (
    <Div className="introduction-container">
      <StyledTable>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderData(data)}</tbody>
      </StyledTable>
    </Div>
  );
}

export default Introduction;
