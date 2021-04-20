import React from "react";

function Page({ className }) {
  return <div className={`${className ?? ""}`}></div>;
}

export default Page;
