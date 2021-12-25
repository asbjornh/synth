import React from "react";
import { Envelope as EnvType } from "../../../interface/state";
import { Control, ControlStrip } from "../control-strip/control-strip";
import { Knob } from "../knob/knob";

export const defaultEnvelope: EnvType = {
  A: 0,
  D: 0.1,
  S: 0.5,
  R: 0.2,
};

export const Envelope: React.FC<{
  envelope: EnvType;
  onChange: (env: EnvType) => void;
}> = (props) => {
  const patch =
    <K extends keyof EnvType>(param: K) =>
    (value: number) =>
      props.onChange({ ...props.envelope, [param]: value });

  return (
    <ControlStrip>
      <Control label="Attack">
        <Knob
          min={0}
          max={5}
          value={props.envelope.A}
          step={0.001}
          onChange={patch("A")}
        />
      </Control>

      <Control label="Decay">
        <Knob
          min={0}
          max={5}
          value={props.envelope.D}
          step={0.001}
          onChange={patch("D")}
        />
      </Control>

      <Control label="Sustain">
        <Knob
          min={0}
          max={1}
          value={props.envelope.S}
          step={0.01}
          onChange={patch("S")}
        />
      </Control>

      <Control label="Release">
        <Knob
          min={0}
          max={5}
          value={props.envelope.R}
          step={0.001}
          onChange={patch("R")}
        />
      </Control>
    </ControlStrip>
  );
};
