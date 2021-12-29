import React, { useEffect, useState } from "react";
import { Distortion as DistortionOpts } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";

export const defaultDistortion: DistortionOpts = {
  gain: 4,
  mix: 1,
  outGain: 1,
};

export const Distortion: React.FC<{
  distortion: DistortionOpts;
  onChange: (opts: DistortionOpts) => void;
}> = ({ distortion, onChange }) => {
  const [gain, setGain] = useState(distortion.gain);
  const [mix, setMix] = useState(distortion.mix);
  const [outGain, setOutGain] = useState(distortion.outGain);

  useEffect(() => onChange({ gain, mix, outGain }), [gain, mix, outGain]);

  return (
    <ControlStrip>
      <Control label="Gain">
        <Knob min={1} max={100} step={0.1} value={gain} onChange={setGain} />
      </Control>

      <Control label="Mix">
        <Knob min={0} max={1} step={0.01} value={mix} onChange={setMix} />
      </Control>

      <Control label="Out" title="Output gain">
        <Knob
          min={0}
          max={1}
          step={0.001}
          value={outGain}
          onChange={setOutGain}
        />
      </Control>
    </ControlStrip>
  );
};
