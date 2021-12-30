import React, { useEffect, useState } from "react";
import { Copy, Trash2 } from "react-feather";
import {
  defaultOscOptions,
  LFO as LFOOpts,
  LFOTarget,
  Osc,
} from "../../../interface/state";
import { useAfterMountEffect } from "../../hooks/use-after-mount-effect";
import { entries } from "../../util";
import { Button } from "../button/button";
import {
  Control,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { oscTypeOptions } from "../oscillator/oscillator";
import { Select } from "../select/select";
import "./LFO.scss";

const targets: Record<LFOTarget, string> = {
  amplitude: "Amplitude",
  cutoff: "Cutoff",
  pitch: "Pitch",
};

const targetOptions = entries(targets).map(([value, label]) => ({
  value,
  label,
}));

export const defaultLFO = (): LFOOpts => ({
  id: String(Date.now()),
  osc: {
    id: String(Date.now()),
    type: "sine",
    options: defaultOscOptions,
  },
  amount: 0.5,
  freq: 5,
  target: "pitch",
});

export const LFO: React.FC<{
  LFO: LFOOpts;
  onChange: (LFO: LFOOpts) => void;
  onRemove: () => void;
}> = ({ LFO, onChange, onRemove }) => {
  const [type, setType] = useState(LFO.osc.type);
  const [amount, setAmount] = useState(LFO.amount);
  const [freq, setFreq] = useState(LFO.freq);
  const [target, setTarget] = useState(LFO.target);

  useAfterMountEffect(() => {
    const oscCommon = { id: String(Date.now()), options: defaultOscOptions };
    const osc: Osc =
      type === "pulse"
        ? { ...oscCommon, type, pulse: { width: 0.5 } }
        : type === "nesTriangle"
        ? { ...oscCommon, type, nesTriangle: { samples: 16 } }
        : { ...oscCommon, type };
    onChange({
      id: LFO.id,
      osc,
      amount,
      freq,
      target,
    });
  }, [type, amount, freq, target]);

  return (
    <ControlStrip>
      <ControlStack>
        <Control>
          <div className="lfo__selects">
            <label>Wave</label>
            <Select value={type} options={oscTypeOptions} onChange={setType} />
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

      <Control label="Amount">
        <Knob min={0} max={1} step={0.01} value={amount} onChange={setAmount} />
      </Control>

      <Control label="Freq">
        <Knob
          interpolation="exponential"
          min={0.1}
          max={20}
          step={0.1}
          value={freq}
          onChange={setFreq}
        />
      </Control>
    </ControlStrip>
  );
};
