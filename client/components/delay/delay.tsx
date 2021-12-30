import React, { useEffect, useState } from "react";
import { Delay as DelayOpts } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";

export const defaultDelay: DelayOpts = {
  length: 0.5,
  feedback: 0.5,
  mix: 0.5,
};

export const Delay: React.FC<{
  delay: DelayOpts;
  onChange: (delay: DelayOpts) => void;
}> = ({ delay, onChange }) => {
  const [length, setLength] = useState(delay.length);
  const [feedback, setFeedback] = useState(delay.feedback);
  const [mix, setMix] = useState(delay.mix);

  useEffect(() => onChange({ length, feedback, mix }), [length, feedback, mix]);

  return (
    <ControlStrip>
      <Control label="Length" title="Length in seconds">
        <Knob
          min={0.01}
          max={1}
          step={0.01}
          value={length}
          onChange={setLength}
        />
      </Control>

      <Control label="Feedback">
        <Knob
          min={0}
          max={1}
          step={0.01}
          value={feedback}
          onChange={setFeedback}
        />
      </Control>

      <Control label="Mix">
        <Knob min={0} max={1} step={0.01} value={mix} onChange={setMix} />
      </Control>
    </ControlStrip>
  );
};
