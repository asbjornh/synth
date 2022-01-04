import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Copy,
  Square,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "react-feather";
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
  balance: "Balance",
  cutoff: "Cutoff",
  pitch: "Pitch",
};

const targetOptions = entries(targets).map(([value, label]) => ({
  value,
  label,
}));

export const defaultLFO = (): LFOOpts => ({
  id: String(Date.now()),
  osc: "sine",
  amount: 0.5,
  freq: 3,
  sync: false,
  target: "amplitude",
});

export const LFO: React.FC<{
  LFO: LFOOpts;
  onChange: (LFO: LFOOpts) => void;
  onRemove: () => void;
}> = ({ LFO, onChange, onRemove }) => {
  const [osc, setOsc] = useState(LFO.osc);
  const [amount, setAmount] = useState(LFO.amount);
  const [freq, setFreq] = useState(LFO.freq);
  const [target, setTarget] = useState(LFO.target);
  const [sync, setSync] = useState(LFO.sync);

  useAfterMountEffect(() => {
    onChange({
      id: LFO.id,
      osc,
      amount,
      freq,
      sync,
      target,
    });
  }, [osc, amount, freq, sync, target]);

  return (
    <ControlStrip>
      <ControlStack>
        <Control>
          <div className="lfo__selects">
            <label>Wave</label>
            <Select value={osc} options={oscTypeOptions} onChange={setOsc} />
            <label>Target</label>
            <Select
              value={target}
              options={targetOptions}
              onChange={setTarget}
            />
          </div>
        </Control>
        <Control>
          <div className="lfo__buttons">
            <Button onClick={onRemove}>
              <Trash2 />
            </Button>
            <Button onClick={() => setSync((s) => !s)}>
              <div title="Sync LFO to note start" className="lfo__sync">
                Sync {sync ? <CheckSquare /> : <Square />}
              </div>
            </Button>
          </div>
        </Control>
      </ControlStack>

      <Control label="Amount">
        <Knob
          min={0}
          max={1}
          step={0.01}
          value={amount}
          onChange={setAmount}
          theme="green"
        />
      </Control>

      <Control label="Freq">
        <Knob
          interpolation="exponential"
          min={0.1}
          max={40}
          step={0.1}
          value={freq}
          onChange={setFreq}
          theme="green"
        />
      </Control>
    </ControlStrip>
  );
};
