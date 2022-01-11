import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const skrollex: Preset = {
  ...defaultParams,
  displayName: "Skrollex",
  distortion: {
    gain: 26.3,
    mix: 1,
    outGain: 1,
  },
  envelopes: [
    {
      amount: -2.96,
      target: "cutoff",
      tension: 0,
      A: 0,
      D: 0.325,
      S: 0,
      R: 0.2,
    },
  ],
  filter: {
    shape: "low-pass",
    cutoff: 1285,
    Q: 3.2,
    bellGain: -24,
  },
  FMOscs: [
    {
      id: "skrollex-fm-0",
      gain: 13.8,
      ratio: 0.5,
      target: "all",
      type: "sine",
    },
  ],
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 4,
    EQLow: 11,
    gain: 0.16,
    transpose: -2,
  },
  oscillators: [
    {
      id: "1641501498532",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 1,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
  ],
};
