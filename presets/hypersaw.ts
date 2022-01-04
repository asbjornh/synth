import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const hypersaw: Preset = {
  ...defaultParams,
  displayName: "Hypersaw",
  envelopes: [
    { amount: 1, target: "amplitude", tension: 0, A: 0.1, D: 0, S: 1, R: 0.5 },
  ],
  oscillators: [
    {
      id: "1640707463632",
      type: "saw",
      options: {
        ...defaultOscOptions,
        gain: 0.38,
        unison: 10,
        detuneU: 57,
        widthU: 1,
        phase: 0.18,
      },
    },
    {
      id: "1640707592135",
      type: "saw",
      options: {
        ...defaultOscOptions,
        gain: 0.3,
        widthU: 1,
        phase: 0.4,
      },
    },
    {
      id: "1640707699200",
      options: {
        ...defaultOscOptions,
        gain: 0.15,
      },
      type: "noise",
    },
  ],
};
