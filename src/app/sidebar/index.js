import React, { useState } from "react";

// this is a sample
const printObjectState = {
  name: "reimburseForm",
  label: "报销单",
  fields: [
    { name: "formCode", label: "单据号" },
    { name: "comment", label: "备注" },
  ],
  children: [
    {
      name: "feeList",
      label: "费用明细",
      relationType: "MANY",
      fields: [
        { name: "amount", label: "金额" },
        { name: "comment", label: "事由" },
      ],
    },
    {
      name: "department",
      label: "报销部门",
      fields: [
        { name: "name", label: "部门名称" },
        { name: "businessCode", label: "部门编码" },
      ],
    },
  ],
};

function Page({ className }) {
  const [state] = useState(printObjectState);
  return <div className={`${className ?? ""}`}></div>;
}

export default Page;
