import React from "react";
import { Route, Switch } from "react-router-dom";

import Introduction from "./introduction";
import Report from "./report";

function Pages() {
  return (
    <div className="content-container">
      <Switch>
        <Route path={"/report"}>
          <Report />
        </Route>
        <Route>
          <Introduction />
        </Route>
      </Switch>
    </div>
  );
}

export default Pages;
