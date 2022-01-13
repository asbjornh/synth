import { Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const vibraphone: Preset = {
  ...defaultParams,
  displayName: "Vibraphone",
  compressor: {
    attack: 0.1,
    ratio: 151.2,
    release: 0.2,
    threshold: 0.33,
  },
  delay: {
    length: 1,
    feedback: 0.5,
    mix: 0.11,
    pingPong: 0,
  },
  envelopes: [
    {
      amount: 1,
      target: "FM_0_amp",
      tension: 2.5,
      A: 0,
      D: 1.275,
      S: 0.14,
      R: 1.575,
    },
    {
      amount: 1,
      target: "amplitude",
      tension: 1.9,
      A: 0,
      D: 1.5,
      S: 0.32,
      R: 2.45,
    },
  ],
  FMOscs: [
    {
      id: "vibraphone-fm-0",
      gain: 0.8,
      ratio: 10,
      target: "all",
      type: "sine",
    },
  ],
  LFOs: [
    {
      id: "1641688266117",
      osc: "sine",
      amount: 1,
      freq: 0.7,
      sync: false,
      target: "balance",
    },
  ],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 4,
    gain: 0.14,
    recording: false,
    transpose: 0,
  },
  oscillators: [
    {
      id: "1641687982151",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 1,
        octave: 0,
        unison: 2,
        detuneU: 0.1,
        widthU: 1,
        phase: 0.52,
      },
      type: "sine",
    },
  ],
};
