import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const ghostPipes: Preset = {
  ...defaultParams,
  displayName: "Ghost pipes",
  compressor: {
    attack: 0.1,
    ratio: 256,
    release: 0.2,
    threshold: 0.6,
  },
  delay: {
    length: 0.5,
    feedback: 0.5,
    mix: 0.3,
    pingPong: 0,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: -1.3,
      A: 0.525,
      D: 0,
      S: 1,
      R: 0.725,
    },
  ],
  filter: {
    shape: "low-pass",
    cutoff: 10000,
    Q: 1,
    bellGain: -24,
  },
  FMOscs: [
    {
      id: "ghost-fm-0",
      target: "all",
      type: "noise",
      gain: 0.4,
      ratio: 1,
    },
  ],
  LFOs: [
    {
      id: "1641250633257",
      osc: "sine",
      amount: 0.51,
      freq: 1,
      sync: false,
      target: "balance",
    },
  ],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 0,
    gain: 0.3,
    transpose: 0,
  },
  oscillators: [
    {
      id: "1641249179523",
      options: {
        balance: 0.23,
        gain: 1,
        coarse: 0,
        fine: 0,
        octave: 1,
        unison: 4,
        detuneU: 39,
        widthU: 1,
        phase: 0.5,
      },
      type: "nesTriangle",
      nesTriangle: {
        samples: 16,
      },
    },
    {
      id: "1641249357602",
      options: {
        balance: -0.13,
        gain: 0.1,
        coarse: 0,
        fine: 0,
        octave: 0,
        unison: 2,
        detuneU: 40,
        widthU: 1,
        phase: 0,
      },
      type: "pulse",
      pulse: {
        width: 0.669,
      },
    },
    {
      id: "1641249487784",
      options: {
        balance: 0,
        gain: 0.33,
        coarse: 0,
        fine: 0,
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
