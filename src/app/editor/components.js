import styled from "styled-components";
import FullDiv from "@/components/full-div";

const row_number_width = 50;
const col_number_height = 40;

export const EditorDiv = styled(FullDiv)`
  position: relative;
  .header-wraper {
    width: 100%;
    height: ${col_number_height}px;
  }

  .content-wraper {
    width: 100%;
    height: calc(100% - ${col_number_height}px);
  }

  .auxiliary-line-wraper {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  .row-numbers {
    width: ${row_number_width}px;
    flex: 0 0 auto;
    height: 100%;
    padding-bottom: 20px;
  }

  .content {
    flex: 1 0 auto;
    height: 100%;
    width: calc(100% - ${row_number_width}px);
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  padding-right: 20px;
  .header-columns {
    flex: 1 0 auto;
    width: calc(100% - ${row_number_width}px);
    overflow: hidden;
  }
`;

export const TopLeft = styled.div`
  width: ${row_number_width}px;
  flex: 0 0 auto;
  border: 1px solid black;
`;
