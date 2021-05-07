import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="side-bar">
      <nav>
        <ul>
          <li>
            <Link to="/introduction">Introduction</Link>
          </li>
          <li>
            <Link to="/servers">Servers</Link>
          </li>
          <li>
            <Link to="/scripts-management">Scripts Managment</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
