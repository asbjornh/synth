import React, { useEffect, useState } from "react";
import { Osc } from "../../../interface/state";
import { Knob } from "../knob/knob";
import { Label } from "../label/label";

import "./oscillator.scss";

export const defaultOsc = (): Osc => ({
  id: String(Date.now()),
  type: "saw",
  options: {
    gain: 1,
    detune: 0,
    octave: 0,
  },
});

const types: Record<Osc["type"], string> = {
  saw: "Saw",
  square: "Square",
  sine: "Sine",
  triangle: "Triangle",
  nesTriangle: "NES Triangle",
  pulse: "Pulse",
};

export const Oscillator: React.FC<{
  onChange: (osc: Osc) => void;
  onRemove: () => void;
  osc: Osc;
}> = ({ onChange, onRemove, osc }) => {
  const [gain, setGain] = useState(osc.options.gain);
  const [detune, setDetune] = useState(osc.options.detune);
  const [octave, setOctave] = useState(osc.options.octave);
  const changeType = (type: any) => onChange({ ...osc, type });

  useEffect(() => {
    onChange({ ...osc, options: { ...osc.options, gain, detune, octave } });
  }, [gain, detune, octave]);

  return (
    <div className="oscillator">
      <label>
        <Label className="oscillator__label">Wave</Label>
        <select value={osc.type} onChange={(e) => changeType(e.target.value)}>
          {Object.entries(types).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <Knob
        label="Gain"
        min={0}
        max={1}
        step={0.01}
        value={gain}
        onChange={setGain}
      />

      <Knob
        label="Detune"
        min={-24}
        max={24}
        value={detune}
        step={1}
        onChange={setDetune}
      />

      <Knob
        label="Octave"
        min={-4}
        max={4}
        value={octave}
        step={1}
        onChange={setOctave}
      />

      <button onClick={onRemove}>Remove</button>
    </div>
  );
};
