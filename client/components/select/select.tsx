import React from "react";
import "./select.scss";

export const Select = <T extends string>(props: {
  value: T;
  onChange: (value: T) => void;
  options: { disabled?: boolean; value: T; label: string }[];
}) => {
  const { value, options, onChange } = props;

  return (
    <select
      className="select"
      onChange={(e) => onChange(e.target.value as T)}
      value={value}
    >
      {options.map(({ disabled, value, label }) => (
        <option disabled={disabled} key={value + label} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
