import React, { useState, useRef, useEffect } from "react";
import Control from "./controls";
import styled from "styled-components";

// this is a sample
const printObjectState = {
  name: "reimburseForm",
  label: "报销单",
  objectKey: "reimburseForm",
  fields: [
    { name: "formCode", label: "单据号", fieldKey: "reimburseForm.formCode" },
    { name: "comment", label: "备注", fieldKey: "reimburseForm.comment" },
  ],
  children: [
    {
      name: "feeList",
      label: "费用明细",
      relationType: "MANY",
      objectKey: "reimburseForm.feeList",
      fields: [
        {
          name: "amount",
          label: "金额",
          fieldKey: "reimburseForm.feeList.amount",
        },
        {
          name: "comment",
          label: "事由",
          fieldKey: "reimburseForm.feeList.comment",
        },
      ],
      children: [
        {
          name: "cover",
          label: "承担人",
          objectKey: "reimburseForm.feeList.cover",
          type: "ONE",
          fields: [
            {
              name: "name",
              label: "姓名",
              fieldKey: "eimburseForm.feeList.cover.name",
            },
            {
              name: "employeeId",
              label: "工号",
              fieldKey: "eimburseForm.feeList.cover.employeeId",
            },
          ],
        },
      ],
    },
    {
      name: "department",
      label: "报销部门",
      relationType: "ONE",
      objectKey: "reimburseForm.department",
      fields: [
        {
          name: "name",
          label: "部门名称",
          fieldKey: "reimburseForm.department.name",
        },
        {
          name: "businessCode",
          label: "部门编码",
          fieldKey: "reimburseForm.department.businessCode",
        },
      ],
    },
  ],
};

const SidebarDiv = styled.div`
  .draggable:active {
    cursor: grabbing;
  }
`;

function Page({ className }) {
  return (
    <SidebarDiv className={`${className ?? ""}`}>
      <div>打印对象</div>
      <div>
        <Control printObject={printObjectState} />
      </div>
    </SidebarDiv>
  );
}

export default Page;
