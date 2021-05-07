import React from "react";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Pages from "./pages";
import Sidebar from "./side-bar";

const AppDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .side-bar {
    width: 300px;
    flex: 0 0 auto;
  }

  .content-container {
    width: calc(100% - 300px);
    flex: 0 0 auto;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <AppDiv>
        <Sidebar />
        <Pages />
      </AppDiv>
    </BrowserRouter>
  );
}

export default App;
