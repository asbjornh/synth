import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const popcorn: Preset = {
  ...defaultParams,
  master: {
    ...defaultParams.master,
    gain: 0.5,
    transpose: 1,
  },
  displayName: "Popcorn",
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 0,
      A: 0.01,
      D: 0.01,
      S: 0,
      R: 0,
    },
  ],
  filter: {
    shape: "low-pass",
    cutoff: 3150,
    Q: 2,
    bellGain: 1,
  },
  oscillators: [
    {
      id: "popcorn",
      type: "square",
      options: defaultOscOptions,
    },
  ],
};
