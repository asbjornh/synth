import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const basicBass: Preset = {
  ...defaultParams,
  displayName: "Basic bass",
  distortion: {
    gain: 3,
    mix: 1,
    outGain: 1,
  },
  envelopes: [
    {
      amount: 4,
      target: "cutoff",
      tension: 2.9,
      A: 0,
      D: 0.5,
      S: 0,
      R: 0.2,
    },
    {
      amount: 1,
      target: "amplitude",
      tension: 3.3,
      A: 0,
      D: 0.3,
      S: 0.15,
      R: 0,
    },
    {
      amount: 1.4,
      target: "pitch",
      tension: 0,
      A: 0.025,
      D: 0,
      S: 1,
      R: 0,
    },
  ],
  filter: {
    shape: "low-pass",
    cutoff: 257,
    Q: 1.6,
    bellGain: -24,
  },
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 0,
    gain: 0.46,
    transpose: -2,
  },
  oscillators: [
    {
      id: "1641251268946",
      type: "saw",
      options: {
        balance: 0,
        gain: 1,
        coarse: 0,
        fine: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
    },
    {
      id: "1641251636881",
      options: {
        balance: 0,
        gain: 0.66,
        coarse: 0,
        fine: 0,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "triangle",
    },
  ],
};
