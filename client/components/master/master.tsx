import React, { useEffect, useState } from "react";
import { Master as MasterOpts } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Waveform } from "../waveform/waveform";

export const Master: React.FC<{
  master: MasterOpts;
  onChange: (master: MasterOpts) => void;
}> = ({ master, onChange }) => {
  const [dcOffset, setDcOffset] = useState(master.dcOffset);
  const [EQLow, setEQLow] = useState(master.EQLow);
  const [EQHigh, setEQHigh] = useState(master.EQHigh);
  const [gain, setGain] = useState(master.gain);
  const [transpose, setTranspose] = useState(master.transpose);

  useEffect(
    () => onChange({ dcOffset, EQHigh, EQLow, gain, transpose }),
    [dcOffset, EQLow, EQHigh, gain, transpose]
  );

  return (
    <ControlStrip>
      <Control label="EQ low">
        <Knob
          centered
          min={-24}
          max={24}
          step={1}
          value={EQLow}
          onChange={setEQLow}
        />
      </Control>
      <Control label="EQ high">
        <Knob
          centered
          min={-24}
          max={24}
          step={1}
          value={EQHigh}
          onChange={setEQHigh}
        />
      </Control>
      <Control label="Gain">
        <Knob min={0} max={1} step={0.01} value={gain} onChange={setGain} />
      </Control>

      <Control label="DC Off." title="DC offset">
        <Knob
          centered
          min={-1}
          max={1}
          step={0.01}
          value={dcOffset}
          onChange={setDcOffset}
        />
      </Control>

      <Control label="Transp." title="Transpose (octaves)">
        <Knob
          centered
          min={-4}
          max={4}
          step={1}
          value={transpose}
          onChange={setTranspose}
        />
      </Control>
      <Control label="Wave">
        <Waveform />
      </Control>
    </ControlStrip>
  );
};
