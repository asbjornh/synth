import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const hypersaw: Preset = {
  ...defaultParams,
  displayName: "Hypersaw",
  ampEnv: {
    A: 0.1,
    D: 0,
    S: 1,
    R: 0.5,
  },
  filterEnvAmt: 0,
  oscillators: [
    {
      id: "1640707463632",
      type: "saw",
      options: {
        balance: 0,
        gain: 0.38,
        detune: 0,
        octave: 0,
        unison: 10,
        detuneU: 57,
        widthU: 1,
        phase: 0.47,
      },
    },
    {
      id: "1640707592135",
      type: "saw",
      options: {
        balance: 0,
        gain: 0.3,
        detune: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 1,
        phase: 0.4,
      },
    },
    {
      id: "1640707699200",
      options: {
        balance: 0,
        gain: 0.15,
        detune: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "noise",
    },
  ],
};
