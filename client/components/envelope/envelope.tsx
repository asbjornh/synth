import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "react-feather";
import { Envelope as EnvType, EnvelopeTarget } from "../../../interface/state";
import { entries } from "../../util";
import { Button } from "../button/button";
import {
  Control,
  ControlStack,
  ControlStrip,
} from "../control-strip/control-strip";
import { Knob } from "../knob/knob";
import { Select } from "../select/select";

export const defaultEnvelope: EnvType = {
  amount: 1,
  target: "amplitude",
  tension: 0,
  A: 0,
  D: 0.1,
  S: 0.5,
  R: 0.2,
};

const targets: Record<EnvelopeTarget, string> = {
  amplitude: "Amplitude",
  cutoff: "Cutoff",
  pitch: "Pitch",
  FM_0_amp: "FM 1 amplitude",
  FM_0_pitch: "FM 1 pitch",
  FM_1_amp: "FM 2 amplitude",
  FM_1_pitch: "FM 2 pitch",
  FM_2_amp: "FM 3 amplitude",
  FM_2_pitch: "FM 3 pitch",
};

const targetOptions = entries(targets).map(([value, label]) => ({
  value,
  label,
}));

export const Envelope: React.FC<{
  envelope: EnvType;
  onChange: (env: EnvType) => void;
  onDelete: () => void;
}> = ({ envelope, onChange, onDelete }) => {
  const [amount, setAmount] = useState(envelope.amount);
  const [target, setTarget] = useState(envelope.target);
  const [tension, setTension] = useState(envelope.tension);
  const [A, setA] = useState(envelope.A);
  const [D, setD] = useState(envelope.D);
  const [S, setS] = useState(envelope.S);
  const [R, setR] = useState(envelope.R);

  useEffect(() => {
    onChange({
      amount: target === "amplitude" ? 1 : amount,
      target,
      tension,
      A,
      D,
      S,
      R,
    });
  }, [amount, target, tension, A, D, S, R]);

  return (
    <ControlStrip>
      <ControlStack>
        <Control label="Target">
          <Select options={targetOptions} onChange={setTarget} value={target} />
        </Control>

        <Control>
          <Button onClick={onDelete}>
            <Trash2 />
          </Button>
        </Control>
      </ControlStack>

      <Control label="Attack">
        <Knob
          min={0}
          max={5}
          step={0.001}
          value={envelope.A}
          onChange={setA}
          theme="blue"
        />
      </Control>

      <Control label="Decay">
        <Knob
          min={0}
          max={5}
          step={0.001}
          value={envelope.D}
          onChange={setD}
          theme="blue"
        />
      </Control>

      <Control label="Sustain">
        <Knob
          min={0}
          max={1}
          step={0.01}
          value={envelope.S}
          onChange={setS}
          theme="blue"
        />
      </Control>

      <Control label="Release">
        <Knob
          min={0}
          max={5}
          step={0.001}
          value={envelope.R}
          onChange={setR}
          theme="blue"
        />
      </Control>

      <Control label="Tension">
        <Knob
          centered
          min={-10}
          max={10}
          step={0.1}
          value={envelope.tension}
          onChange={setTension}
          theme="blue"
        />
      </Control>

      {target !== "amplitude" &&
        target !== "FM_0_amp" &&
        target !== "FM_1_amp" &&
        target !== "FM_2_amp" && (
          <Control label="Amount">
            <Knob
              centered
              min={-4}
              max={4}
              step={0.001}
              value={envelope.amount}
              onChange={setAmount}
              theme="blue"
            />
          </Control>
        )}
    </ControlStrip>
  );
};
