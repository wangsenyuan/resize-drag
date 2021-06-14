import React from "react";
import LabelDiv from "./label-div";

function DateInput({ value, onChange, label, className }) {
  return (
    <LabelDiv className={className} label={label}>
      <input type="date" value={value} onChange={onChange} />
    </LabelDiv>
  );
}

export default DateInput;
