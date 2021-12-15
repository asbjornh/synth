import React, { useEffect, useState } from "react";
import { Filter as FilterType } from "../../../interface/state";
import { Knob } from "../knob/knob";
import "./filter.scss";

export const defaultFilter: FilterType = {
  shape: "low-pass",
  cutoff: 1000,
  Q: 0.5,
  bellGain: 1,
};

const types: Record<FilterType["shape"], string> = {
  "low-pass": "Low pass",
  "band-pass": "Band pass",
  "high-pass": "High pass",
  notch: "Notch",
  peak: "Peak",
  "all-pass": "All pass",
  "bell-pass": "Bell",
  "low-shelf": "Low shelf",
  "high-shelf": "High shelf",
};

export const Filter: React.FC<{
  filter: FilterType;
  onChange: (filter: FilterType) => void;
}> = ({ filter, onChange }) => {
  const [cutoff, setCutoff] = useState(filter.cutoff);
  const [Q, setQ] = useState(filter.Q);

  const changeType = (shape: any) => onChange({ ...filter, shape });

  useEffect(() => onChange({ ...filter, cutoff, Q }), [cutoff, Q]);

  return (
    <div className="filter">
      <select value={filter.shape} onChange={(e) => changeType(e.target.value)}>
        {Object.entries(types).map(([shape, label]) => (
          <option key={shape} value={shape}>
            {label}
          </option>
        ))}
      </select>

      <Knob
        label="Cutoff"
        min={0}
        max={10_000}
        value={cutoff}
        step={1}
        onChange={setCutoff}
      />

      <Knob label="Q" min={0.1} max={10} value={Q} step={0.1} onChange={setQ} />
    </div>
  );
};
