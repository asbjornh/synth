import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const softPlastic: Preset = {
  ...defaultParams,
  displayName: "Soft plastic",
  compressor: {
    attack: 0.01,
    ratio: 1000,
    release: 0.5,
    threshold: 0.5,
  },
  master: {
    ...defaultParams.master,
    dcOffset: 0.7,
    gain: 0.6,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 0,
      A: 0,
      D: 0.55,
      S: 0.4,
      R: 1.5,
    },
    {
      amount: 2,
      target: "cutoff",
      tension: 1,
      A: 0,
      D: 0.55,
      S: 0,
      R: 1.25,
    },
  ],
  delay: {
    pingPong: 0.7,
    length: 0.5,
    feedback: 0.5,
    mix: 0.4,
  },
  filter: {
    shape: "low-pass",
    cutoff: 850,
    Q: 1.5,
    bellGain: 1,
  },
  LFOs: [
    {
      id: "1640904063882",
      osc: {
        id: "1640904063882",
        type: "sine",
        options: defaultOscOptions,
      },
      amount: 0.5,
      freq: 3,
      sync: true,
      target: "amplitude",
    },
  ],
  oscillators: [
    {
      id: "1640904060659",
      options: {
        ...defaultOscOptions,
        balance: -1,
        fine: 1,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1640904230578",
      options: {
        ...defaultOscOptions,
        balance: 1,
        fine: -1,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1640904306328",
      options: {
        ...defaultOscOptions,
        gain: 0.55,
      },
      type: "pulse",
      pulse: {
        width: 0.949,
      },
    },
  ],
};
