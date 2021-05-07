import React from "react";
import { Route, Switch } from "react-router-dom";

import Introduction from "./introduction";

function Pages() {
  return (
    <div className="content-container">
      <Switch>
        <Route>
          <Introduction />
        </Route>
      </Switch>
    </div>
  );
}

export default Pages;
