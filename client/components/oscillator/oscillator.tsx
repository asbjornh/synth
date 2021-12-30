import React, { useEffect, useMemo, useState } from "react";
import { Copy, Trash2 } from "react-feather";
import { defaultOscOptions, Osc, Pulse } from "../../../interface/state";
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
  options: defaultOscOptions,
});

const types: Record<Osc["type"], string> = {
  saw: "Saw",
  square: "Square",
  sine: "Sine",
  triangle: "Triangle",
  nesTriangle: "NES Triangle",
  pulse: "Pulse",
  noise: "White noise",
};

const typeOptions = entries(types).map(([value, label]) => ({
  value,
  label,
}));

export const Oscillator: React.FC<{
  onChange: (osc: Osc) => void;
  onDuplicate: (osc: Osc) => void;
  onRemove: () => void;
  osc: Osc;
}> = ({ onChange, onDuplicate, onRemove, osc }) => {
  // NOTE: Backwards compat for user presets
  const init = { ...defaultOscOptions, ...osc.options };

  const [balance, setBalance] = useState(init.balance);
  const [gain, setGain] = useState(init.gain);
  const [detune, setDetune] = useState(init.detune);
  const [octave, setOctave] = useState(init.octave);
  const [pw, setPw] = useState((osc as Pulse).pulse?.width ?? 0.5);
  const [unison, setUnison] = useState(init.unison);
  const [detuneU, setDetuneU] = useState(init.detuneU);
  const [widthU, setWidthU] = useState(init.widthU);
  const [phase, setPhase] = useState(init.phase);

  const changeType = (type: Osc["type"]) => {
    const common = { id: osc.id, options: init };
    if (type === "pulse")
      return onChange({ ...common, type, pulse: { width: 0.5 } });
    if (type === "nesTriangle")
      return onChange({ ...common, type, nesTriangle: { samples: 16 } });
    return onChange({ ...common, type });
  };

  const options: Osc["options"] = useMemo(
    () => ({
      balance,
      gain,
      detune,
      octave,
      unison,
      detuneU,
      widthU,
      phase,
    }),
    [balance, gain, detune, octave, unison, detuneU, widthU, phase]
  );

  const current: Osc = useMemo(() => {
    if (osc.type === "pulse") return { ...osc, options, pulse: { width: pw } };
    return { ...osc, options };
  }, [options, pw]);

  useEffect(() => onChange(current), [current]);

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
            <div className="oscillator__actions">
              <Button onClick={onRemove}>
                <Trash2 />
              </Button>
              <Button onClick={() => onDuplicate(current)}>
                <Copy />
              </Button>
            </div>
          </Control>
        </ControlStack>

        <Control label="Gain">
          <Knob min={0} max={1} step={0.01} value={gain} onChange={setGain} />
        </Control>

        <Control label="Detune">
          <Knob
            centered
            min={-24}
            max={24}
            value={detune}
            step={1}
            onChange={setDetune}
          />
        </Control>

        <Control label="Octave">
          <Knob
            centered
            min={-4}
            max={4}
            value={octave}
            step={1}
            onChange={setOctave}
          />
        </Control>

        <Control label="Balance">
          <Knob
            centered
            min={-1}
            max={1}
            value={balance}
            step={0.01}
            onChange={setBalance}
          />
        </Control>

        <Control label="Phase">
          <Knob min={0} max={1} value={phase} step={0.01} onChange={setPhase} />
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

        <Control label="Unison">
          <Knob min={1} max={16} value={unison} step={1} onChange={setUnison} />
        </Control>

        {unison > 1 && (
          <>
            <Control label="U. det." title="Unison detune">
              <Knob
                min={0}
                max={96}
                step={1}
                value={detuneU}
                onChange={setDetuneU}
              />
            </Control>
            <Control label="Width" title="Unison stereo width">
              <Knob
                min={0}
                max={1}
                step={0.01}
                value={widthU}
                onChange={setWidthU}
              />
            </Control>
          </>
        )}
      </ControlStrip>
    </div>
  );
};
