import React, { useEffect, useState } from "react";
import { VelocityTarget } from "../../../interface/state";
import { entries } from "../../util";
import { Knob } from "../knob/knob";
import "./velocity-targets.scss";

const targetDict: Record<VelocityTarget, string> = {
  FM_0_amplitude: "FM 0 amp.",
  FM_1_amplitude: "FM 1 amp.",
  FM_2_amplitude: "FM 2 amp.",
  amplitude: "Amplitude",
  cutoff: "Cutoff",
};

export const VelocityTargets: React.FC<{
  targets: Partial<Record<VelocityTarget, number>>;
  onChange: (next: Partial<Record<VelocityTarget, number>>) => void;
}> = (props) => {
  const [targets, setTargets] = useState(props.targets);

  const update = (id: VelocityTarget) => (value: number) =>
    setTargets((targets) => ({ ...targets, [id]: value }));

  useEffect(() => props.onChange(targets), [targets]);

  return (
    <div className="velocity-targets">
      {entries(targetDict).map(([id, label]) => (
        <div className="velocity-targets__target" key={id}>
          <label>{label}</label>
          <Knob
            min={0}
            max={1}
            step={0.01}
            value={targets[id] ?? 0}
            onChange={update(id)}
            small
          />
        </div>
      ))}
    </div>
  );
};
