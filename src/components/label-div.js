import React from "react";
import styled from "styled-components";

const Div = styled.div`
  position: relative;
  padding-left: 100px;
  & > * {
    width: calc(100%);
  }

  line-height: 30px;
  vertical-align: middle;

  &::before {
    display: inline-block;
    content: attr(label) ":";
    position: absolute;
    width: 80px;
    left: 0;
    text-align: right;
    height: 30px;
  }
`;

export default Div;
