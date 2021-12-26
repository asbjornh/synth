import { Preset } from "../interface/state";

export const popcorn: Preset = {
  displayName: "Popcorn",
  ampEnv: {
    A: 0.01,
    D: 0.01,
    S: 0,
    R: 0,
  },
  filter: {
    shape: "low-pass",
    cutoff: 3150,
    Q: 2,
    bellGain: 1,
  },
  filterEnv: undefined,
  filterEnvAmt: 0,
  oscillators: [
    {
      id: "popcorn",
      type: "square",
      options: {
        gain: 0.5,
        detune: 0,
        octave: 1,
        balance: 0,
      },
    },
  ],
};
