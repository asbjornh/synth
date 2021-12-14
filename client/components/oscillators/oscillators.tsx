import React from "react";
import { Osc } from "../../../interface/state";
import { defaultOsc, Oscillator } from "../oscillator/oscillator";

import "./oscillators.scss";

export const Oscillators: React.FC<{
  oscillators: Osc[];
  onChange: (oscillators: Osc[]) => void;
}> = ({ oscillators, onChange }) => {
  const addOsc = () => onChange(oscillators.concat(defaultOsc));

  const setOsc = (index: number) => (osc: Osc) =>
    onChange(oscillators.map((o, i) => (i === index ? osc : o)));

  const rmOsc = (index: number) =>
    onChange(oscillators.filter((_, i) => i !== index));

  return (
    <div className="oscillators">
      <h2>Oscillators</h2>
      {oscillators.map((osc, index) => (
        <div key={osc.type + index}>
          <Oscillator
            osc={osc}
            onChange={setOsc(index)}
            onRemove={() => rmOsc(index)}
          />
        </div>
      ))}
      <div>
        <button onClick={addOsc}>Add oscillator</button>
      </div>
    </div>
  );
};
