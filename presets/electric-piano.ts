import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const electricPiano: Preset = {
  ...defaultParams,
  displayName: "Electric piano",
  compressor: {
    attack: 0.1,
    ratio: 1000,
    release: 0.2,
    threshold: 0.38,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 1.4,
      A: 0,
      D: 1.05,
      S: 0.26,
      R: 0.925,
    },
    {
      amount: 4,
      target: "cutoff",
      tension: 0.9,
      A: 0,
      D: 0.4,
      S: 0.18,
      R: 0.2,
    },
  ],
  filter: {
    shape: "low-pass",
    cutoff: 759,
    Q: 1,
    bellGain: -24,
  },
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 4,
    EQLow: 0,
    gain: 0.2,
    transpose: 0,
  },
  oscillators: [
    {
      id: "1641333673759",
      options: {
        balance: -0.19,
        coarse: 0,
        fine: 0,
        gain: 0.1,
        octave: 2,
        unison: 2,
        detuneU: 10,
        widthU: 1,
        phase: 0.44,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1641333680208",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 1,
        octave: 0,
        unison: 2,
        detuneU: 10,
        widthU: 1,
        phase: 0.5,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
  ],
};
