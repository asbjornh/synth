import React from "react";
import { Osc } from "../../../interface/state";

export const defaultOsc: Osc = {
  type: "saw",
  options: {
    detune: 0,
  },
};

const types: Record<Osc["type"], string> = {
  saw: "Saw",
  square: "Square",
  sine: "Sine",
  triangle: "Triangle",
  nesTriangle: "NES Triangle",
  pulse: "Pulse",
};

export const OscSelect: React.FC<{ onChange: (osc: Osc) => void; osc: Osc }> =
  ({ onChange, osc }) => {
    const changeType = (type: any) => onChange({ ...osc, type });

    return (
      <div>
        <select value={osc.type} onChange={(e) => changeType(e.target.value)}>
          {Object.entries(types).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </div>
    );
  };
