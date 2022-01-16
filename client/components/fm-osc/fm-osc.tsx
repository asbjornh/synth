import React, { useEffect, useState } from "react";
import { Trash2 } from "react-feather";

import { FMOsc as FMOscOpts, FMTarget } from "../../../interface/state";
import { entries } from "../../util";
import { Button } from "../button/button";
import {
  Control,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Select } from "../select/select";
import "./fm-osc.scss";

export const defaultFMOsc = (): FMOscOpts => ({
  id: String(Date.now()),
  gain: 1,
  ratio: 3,
  target: "0",
  type: "sine",
});

const targets: Record<FMTarget, string> = {
  0: "Osc 1",
  1: "Osc 2",
  2: "Osc 3",
};

const types: Record<FMOscOpts["type"], string> = {
  sine: "Sine",
  noise: "White noise",
};

const typeOptions = entries(types).map(([value, label]) => ({ value, label }));

const targetOptions = entries(targets).map(([value, label]) => ({
  value,
  label,
}));

export const FMOsc: React.FC<{
  osc: FMOscOpts;
  onChange: (osc: FMOscOpts) => void;
  onRemove: () => void;
}> = ({ osc, onChange, onRemove }) => {
  const [gain, setGain] = useState(osc.gain);
  const [ratio, setRatio] = useState(osc.ratio);
  const [target, setTarget] = useState(osc.target);
  const [type, setType] = useState(osc.type);

  useEffect(
    () => onChange({ id: osc.id, gain, ratio, target, type }),
    [osc.id, gain, ratio, target, type]
  );

  return (
    <ControlStrip>
      <ControlStack>
        <Control>
          <div className="fm-osc__selects">
            <label>Wave</label>
            <Select value={type} options={typeOptions} onChange={setType} />
            <label>Target</label>
            <Select
              value={target}
              options={targetOptions}
              onChange={setTarget}
            />
          </div>
        </Control>

        <Control>
          <Button onClick={onRemove}>
            <Trash2 />
          </Button>
        </Control>
      </ControlStack>

      <Control label="Gain">
        <Knob
          theme="purple"
          min={0}
          max={40}
          step={0.01}
          value={gain}
          onChange={setGain}
        />
      </Control>

      <Control label="Ratio">
        <Knob
          theme="purple"
          min={0.01}
          max={40}
          resolution={1000}
          step={0.0001}
          value={ratio}
          onChange={setRatio}
        />
      </Control>
    </ControlStrip>
  );
};
