import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const three03: Preset = {
  ...defaultParams,
  displayName: "303",
  ampEnv: {
    A: 0,
    D: 0.2,
    S: 0,
    R: 0.2,
  },
  filter: {
    shape: "low-pass",
    cutoff: 1700,
    Q: 7,
    bellGain: 1,
  },
  filterEnv: {
    A: 0,
    D: 0.15,
    S: 0.47,
    R: 0.2,
  },
  filterEnvAmt: 3,
  oscillators: [
    {
      id: "1640533702209",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: 0,
        gain: 0.32,
        detune: 0,
        octave: -2,
      },
    },
  ],
};
