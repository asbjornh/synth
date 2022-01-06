import React, { useEffect, useState } from "react";

import { FMOsc as FMOscOpts } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { oscTypeOptions } from "../oscillator/oscillator";
import { Select } from "../select/select";

export const defaultFMOsc: FMOscOpts = {
  gain: 1,
  ratio: 3,
  type: "sine",
};

export const FMOsc: React.FC<{
  osc: FMOscOpts;
  onChange: (osc: FMOscOpts) => void;
}> = ({ osc, onChange }) => {
  const [gain, setGain] = useState(osc.gain);
  const [ratio, setRatio] = useState(osc.ratio);
  const [type, setType] = useState(osc.type);

  useEffect(() => onChange({ gain, ratio, type }), [gain, ratio, type]);

  return (
    <ControlStrip>
      <Control label="Wave">
        <Select value={type} options={oscTypeOptions} onChange={setType} />
      </Control>

      <Control label="Gain">
        <Knob
          theme="purple"
          min={0}
          max={1}
          step={0.01}
          value={gain}
          onChange={setGain}
        />
      </Control>

      <Control label="Ratio">
        <Knob
          theme="purple"
          min={0.01}
          max={10}
          resolution={1000}
          step={0.0001}
          value={ratio}
          onChange={setRatio}
        />
      </Control>
    </ControlStrip>
  );
};
