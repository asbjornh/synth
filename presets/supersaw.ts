import { defaultOscOptions, Preset } from "../interface/state";

export const supersaw: Preset = {
  displayName: "Supersaw",
  ampEnv: {
    A: 0.025,
    D: 0,
    S: 1,
    R: 0.325,
  },
  filter: undefined,
  filterEnv: undefined,
  filterEnvAmt: 0,
  oscillators: [
    {
      id: "1640532681726",
      options: {
        ...defaultOscOptions,
        balance: 0,
        gain: 0.12,
        detune: 0,
        octave: 0,
      },
      type: "noise",
    },
    {
      id: "1640532689044",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: -0.75,
        gain: 0.2,
        detune: -20,
        octave: -1,
      },
    },
    {
      id: "1640532698097",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: -0.29,
        gain: 0.2,
        detune: -12,
        octave: -1,
      },
    },
    {
      id: "1640532718943",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: 0.35,
        gain: 0.2,
        detune: 10,
        octave: -1,
      },
    },
    {
      id: "1640532721196",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: 0.74,
        gain: 0.2,
        detune: 18,
        octave: -1,
      },
    },
  ],
};
