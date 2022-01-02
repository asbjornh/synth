import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const three03: Preset = {
  ...defaultParams,
  displayName: "303",
  master: {
    dcOffset: 0,
    EQLow: 2,
    EQHigh: 5,
    gain: 0.9,
    transpose: -2,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 0,
      A: 0,
      D: 0.4,
      S: 0,
      R: 0.4,
    },
    {
      amount: 0.75,
      target: "cutoff",
      tension: 0,
      A: 0,
      D: 0.2,
      S: 0,
      R: 0.2,
    },
  ],
  distortion: {
    gain: 4,
    mix: 1,
    outGain: 1,
  },
  filter: {
    shape: "low-pass",
    cutoff: 600,
    Q: 7,
    bellGain: 1,
  },
  LFOs: [
    {
      id: "1640907886452",
      osc: {
        id: "1640908078695",
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
        type: "sine",
      },
      amount: 0.14,
      freq: 0.3,
      sync: false,
      target: "cutoff",
    },
  ],
  oscillators: [
    {
      id: "1640533702209",
      type: "saw",
      options: {
        balance: 0,
        gain: 1,
        detune: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
    },
  ],
};
