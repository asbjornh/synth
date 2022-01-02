import React, { useEffect, useState } from "react";

import { Compressor as CompressorOpts } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";

export const defaultCompressor: CompressorOpts = {
  attack: 0.1,
  ratio: 4,
  release: 0.2,
  threshold: 0.8,
};

export const Compressor: React.FC<{
  compressor: CompressorOpts;
  onChange: (compressor: CompressorOpts) => void;
}> = ({ compressor, onChange }) => {
  const [attack, setAttack] = useState(compressor.attack);
  const [ratio, setRatio] = useState(compressor.ratio);
  const [release, setRelease] = useState(compressor.release);
  const [threshold, setThreshold] = useState(compressor.threshold);

  useEffect(
    () => onChange({ attack, ratio, release, threshold }),
    [attack, ratio, release, threshold]
  );

  return (
    <ControlStrip>
      <Control label="Thresh.">
        <Knob
          min={0}
          max={1}
          step={0.01}
          value={threshold}
          onChange={setThreshold}
        />
      </Control>

      <Control label="Ratio">
        <Knob
          interpolation="exponential"
          min={1}
          max={1000}
          step={0.1}
          value={ratio}
          onChange={setRatio}
        />
      </Control>

      <Control label="Attack">
        <Knob
          min={0}
          max={1}
          step={0.001}
          value={attack}
          onChange={setAttack}
        />
      </Control>

      <Control label="Release">
        <Knob
          min={0}
          max={1}
          step={0.01}
          value={release}
          onChange={setRelease}
        />
      </Control>
    </ControlStrip>
  );
};
