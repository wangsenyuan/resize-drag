import React from "react";
import SourceBox from "../dragBox/sourceBox";
import { ControlTypes } from "@app/state";
const originData = [
  {
    id: 1,
    type: ControlTypes.LABEL,
    background: "red",
  },
  {
    id: 2,
    type: ControlTypes.LABEL,
    background: "green",
  },
];

// this is a sample
// const printObjectState = {
//   name: "reimburseForm",
//   label: "报销单",
//   fields: [
//     { name: "formCode", label: "单据号" },
//     { name: "comment", label: "备注" },
//   ],
//   children: [
//     {
//       name: "feeList",
//       label: "费用明细",
//       relationType: "MANY",
//       fields: [
//         { name: "amount", label: "金额" },
//         { name: "comment", label: "事由" },
//       ],
//     },
//     {
//       name: "department",
//       label: "报销部门",
//       fields: [
//         { name: "name", label: "部门名称" },
//         { name: "businessCode", label: "部门编码" },
//       ],
//     },
//   ],
// };

function Page({ className, data = originData }) {
  return (
    <div className={`${className ?? ""}`}>
      <div>打印对象</div>
      <div>
        {data.map((item) => (
          <SourceBox type={item.type} key={item.id}>
            <div
              style={{
                width: 100,
                height: 20,
                background: item.background,
                margin: "10px 0",
              }}
            >
              {item.type}
            </div>
          </SourceBox>
        ))}
      </div>
    </div>
  );
}

export default Page;
