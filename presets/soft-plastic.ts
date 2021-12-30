import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const softPlastic: Preset = {
  ...defaultParams,
  displayName: "Soft plastic",
  ampEnv: {
    A: 0,
    D: 1.125,
    S: 0.41,
    R: 0.725,
  },
  delay: {
    length: 1,
    feedback: 0.5,
    mix: 0.5,
  },
  filter: {
    shape: "low-pass",
    cutoff: 848,
    Q: 1.5,
    bellGain: 1,
  },
  filterEnv: {
    A: 0,
    D: 0.675,
    S: 0,
    R: 0.2,
  },
  filterEnvAmt: 2,
  gain: 0.58,
  LFOs: [
    {
      id: "1640904063882",
      osc: {
        id: "1640904063882",
        type: "sine",
        options: {
          balance: 0,
          gain: 1,
          detune: 0,
          octave: 0,
          phase: 0,
          unison: 1,
          detuneU: 0.1,
          widthU: 0.1,
        },
      },
      amount: 0.5,
      freq: 3,
      target: "amplitude",
    },
  ],
  oscillators: [
    {
      id: "1640904060659",
      options: {
        balance: -1,
        gain: 1,
        detune: 1,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1640904230578",
      options: {
        balance: 1,
        gain: 1,
        detune: -1,
        octave: 0,
        phase: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1640904306328",
      options: {
        balance: 0,
        gain: 0.55,
        detune: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "pulse",
      pulse: {
        width: 0.949,
      },
    },
  ],
  transpose: 0,
};
