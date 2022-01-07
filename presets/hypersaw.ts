import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const hypersaw: Preset = {
  ...defaultParams,
  displayName: "Hypersaw",
  master: {
    ...defaultParams.master,
    gain: 0.4,
    EQHigh: 2,
  },
  distortion: {
    gain: 2,
    mix: 1,
    outGain: 1,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 1.5,
      A: 0.02,
      D: 0,
      S: 1,
      R: 1.5,
    },
  ],
  filter: {
    shape: "peak",
    cutoff: 10_000,
    Q: 1,
    bellGain: -24,
  },
  oscillators: [
    {
      id: "1640707463632",
      type: "saw",
      options: {
        ...defaultOscOptions,
        gain: 0.38,
        unison: 10,
        detuneU: 40,
        widthU: 1,
        phase: 1,
      },
    },
    {
      id: "1640707592135",
      type: "saw",
      options: {
        ...defaultOscOptions,
        gain: 0.2,
        unison: 2,
        widthU: 1,
        detuneU: 4,
      },
    },
    {
      id: "1640707699200",
      options: {
        ...defaultOscOptions,
        gain: 0.1,
      },
      type: "noise",
    },
  ],
};
