import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const arctic: Preset = {
  ...defaultParams,
  displayName: "Arctic",
  delay: {
    length: 0.5,
    feedback: 0.5,
    mix: 0.5,
    pingPong: 0.79,
  },
  envelopes: [
    {
      amount: 1,
      target: "amplitude",
      tension: 1.4,
      A: 0,
      D: 0.925,
      S: 0.4,
      R: 1.725,
    },
  ],
  FMOscs: [
    {
      id: "arctic-fm-0",
      gain: 0.69,
      ratio: 1,
      target: "all",
      type: "noise",
    },
  ],
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 0,
    gain: 0.49,
    transpose: 1,
  },
  oscillators: [
    {
      id: "1641494990064",
      options: {
        balance: -1,
        coarse: 0,
        fine: -10,
        gain: 1,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641495468809",
      options: {
        balance: 1,
        coarse: 0,
        fine: 10,
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
