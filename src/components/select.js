import React from "react";
import LabelDiv from "./label-div";

function Select({ className, label, options, value, onChange }) {
  return (
    <LabelDiv className={className} label={label}>
      <select onChange={onChange} value={value}>
        {options?.map((op) => (
          <option value={op.value} key={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </LabelDiv>
  );
}

export default Select;
