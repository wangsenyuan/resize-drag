import React, { useMemo, useState } from "react";
import "./index.scss";
import { px, last } from "../utils";
import Rows from "./rows";
import Columns from "./columns";
import Content from "./content";
import { SvgMovingContext } from "../context";

const initMovingState = { dir: "vertical", x: 0, y: 0 };

// rows has height, cols has width
const Page = ({ rows, columns, onChangeRow, onChangeColumn }) => {
  const [moving, setMoving] = useState(initMovingState);

  return (
    <div className="resizable-grid-background">
      <SvgMovingContext.Provider
        value={{ currentMove: moving, onCurrentMove: setMoving }}
      >
        <div className="background">
          <div className="top-left-corner grid-cell header-row header-column"></div>
          <Columns columns={columns} onChange={onChangeColumn} />
          <Rows rows={rows} onChange={onChangeRow} />

          <Content rows={rows} columns={columns} />
        </div>
      </SvgMovingContext.Provider>
    </div>
  );
};

export default Page;
