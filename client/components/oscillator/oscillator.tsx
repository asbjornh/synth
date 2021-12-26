import React, { useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import { Osc, Pulse } from "../../../interface/state";
import { entries } from "../../util";
import { Button } from "../button/button";
import {
  Control,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Select } from "../select/select";

import "./oscillator.scss";

export const defaultOsc = (): Osc => ({
  id: String(Date.now()),
  type: "saw",
  options: {
    balance: 0,
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

const typeOptions = entries(types).map(([value, label]) => ({
  value,
  label,
}));

export const Oscillator: React.FC<{
  onChange: (osc: Osc) => void;
  onRemove: () => void;
  osc: Osc;
}> = ({ onChange, onRemove, osc }) => {
  const [balance, setBalance] = useState(osc.options.balance);
  const [gain, setGain] = useState(osc.options.gain);
  const [detune, setDetune] = useState(osc.options.detune);
  const [octave, setOctave] = useState(osc.options.octave);
  const [pw, setPw] = useState((osc as Pulse).pulse?.width ?? 0.5);

  const changeType = (type: Osc["type"]) => {
    const common = { id: osc.id, options: osc.options };
    if (type === "pulse")
      return onChange({ ...common, type, pulse: { width: 0.5 } });
    if (type === "nesTriangle")
      return onChange({ ...common, type, nesTriangle: { samples: 16 } });
    return onChange({ ...common, type });
  };

  useEffect(() => {
    const options = { balance, gain, detune, octave };
    if (osc.type === "pulse")
      return onChange({ ...osc, options, pulse: { width: pw } });
    onChange({ ...osc, options });
  }, [balance, gain, detune, octave, pw]);

  return (
    <div className="oscillator">
      <ControlStrip>
        <ControlStack>
          <Control label="Wave">
            <Select
              value={osc.type}
              options={typeOptions}
              onChange={changeType}
            />
          </Control>

          <Control>
            <Button onClick={onRemove}>
              <Trash2 />
            </Button>
          </Control>
        </ControlStack>

        <Control label="Gain">
          <Knob min={0} max={1} step={0.01} value={gain} onChange={setGain} />
        </Control>

        <Control label="Detune">
          <Knob
            min={-24}
            max={24}
            value={detune}
            step={1}
            onChange={setDetune}
          />
        </Control>

        <Control label="Octave">
          <Knob min={-4} max={4} value={octave} step={1} onChange={setOctave} />
        </Control>

        <Control label="Balance">
          <Knob
            min={-1}
            max={1}
            value={balance}
            step={0.01}
            onChange={setBalance}
          />
        </Control>

        {osc.type === "pulse" && (
          <Control label="Pulse W." title="Pulse width">
            <Knob
              min={0.001}
              max={0.999}
              value={pw}
              step={0.001}
              onChange={setPw}
            />
          </Control>
        )}
      </ControlStrip>
    </div>
  );
};
