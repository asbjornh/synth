import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const supersaw: Preset = {
  ...defaultParams,
  displayName: "Supersaw",
  master: {
    ...defaultParams.master,
    gain: 0.6,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 0,
      A: 0.025,
      D: 0,
      S: 1,
      R: 0.325,
    },
  ],
  oscillators: [
    {
      id: "1640532681726",
      options: {
        ...defaultOscOptions,
        gain: 0.12,
      },
      type: "noise",
    },
    {
      id: "1640532689044",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: -1,
        gain: 0.2,
        fine: -20,
      },
    },
    {
      id: "1640532698097",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: -0.5,
        gain: 0.2,
        fine: -10,
      },
    },
    {
      id: "1640532718943",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: 0.5,
        gain: 0.2,
        fine: 10,
      },
    },
    {
      id: "1640532721196",
      type: "saw",
      options: {
        ...defaultOscOptions,
        balance: 1,
        gain: 0.2,
        fine: 20,
      },
    },
  ],
};
