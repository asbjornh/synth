import React, { useEffect, useRef, useState } from "react";
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
}> = ({ children, envelope, onChange }) => {
  const [A, setA] = useState(envelope.A);
  const [D, setD] = useState(envelope.D);
  const [S, setS] = useState(envelope.S);
  const [R, setR] = useState(envelope.R);

  useEffect(() => {
    onChange({ A, D, S, R });
  }, [A, D, S, R]);

  return (
    <ControlStrip>
      <Control label="Attack">
        <Knob min={0} max={5} step={0.001} value={envelope.A} onChange={setA} />
      </Control>

      <Control label="Decay">
        <Knob min={0} max={5} step={0.001} value={envelope.D} onChange={setD} />
      </Control>

      <Control label="Sustain">
        <Knob min={0} max={1} step={0.01} value={envelope.S} onChange={setS} />
      </Control>

      <Control label="Release">
        <Knob min={0} max={5} step={0.001} value={envelope.R} onChange={setR} />
      </Control>

      {children}
    </ControlStrip>
  );
};
