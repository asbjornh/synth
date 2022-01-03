import React, { useEffect, useState } from "react";
import { Filter as FilterType } from "../../../interface/state";
import { entries } from "../../util";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Select } from "../select/select";
import "./filter.scss";

export const defaultFilter: FilterType = {
  shape: "low-pass",
  cutoff: 5000,
  Q: 0.5,
  bellGain: -24,
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

const typeOptions = entries(types).map(([value, label]) => ({ value, label }));

export const Filter: React.FC<{
  filter: FilterType;
  onChange: (filter: FilterType) => void;
}> = ({ filter, onChange }) => {
  const [cutoff, setCutoff] = useState(filter.cutoff);
  const [Q, setQ] = useState(filter.Q);

  const changeType = (shape: FilterType["shape"]) =>
    onChange({ ...filter, shape });

  useEffect(() => onChange({ ...filter, cutoff, Q }), [cutoff, Q]);

  return (
    <div className="filter">
      <ControlStrip>
        <Control label="Type">
          <Select
            value={filter.shape}
            options={typeOptions}
            onChange={changeType}
          />
        </Control>

        <Control label="Cutoff">
          <Knob
            interpolation="exponential"
            min={20}
            max={10_000}
            value={cutoff}
            step={1}
            onChange={setCutoff}
            theme="purple"
          />
        </Control>

        <Control label="Q">
          <Knob
            min={0.1}
            max={10}
            value={Q}
            step={0.1}
            onChange={setQ}
            theme="purple"
          />
        </Control>
      </ControlStrip>
    </div>
  );
};
