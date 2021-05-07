import styled from "styled-components";

const StyledTable = styled.table`
  border: 1px solid black;
  thead {
    tr {
      background-color: #cfcfcf;
      th {
        border-right: 1px solid black;
      }
    }
  }

  tbody {
    td {
      border-right: 1px solid black;
    }

    tr:nth-child(even) {
      background-color: #f0f0f0;
    }
  }
`;

export default StyledTable;
