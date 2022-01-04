import { defaultOscOptions, Preset } from "../interface/state";
import { defaultParams } from "./default-params";

export const hammondOrgan: Preset = {
  ...defaultParams,
  displayName: "Hammond Organ",
  compressor: {
    attack: 0.1,
    ratio: 1000,
    release: 0.2,
    threshold: 0.7,
  },
  envelopes: [],
  LFOs: [
    {
      id: "1641319195859",
      osc: {
        id: "1641319210203",
        options: defaultOscOptions,
        type: "sine",
      },
      amount: 0.3,
      freq: 1,
      sync: false,
      target: "balance",
    },
    {
      id: "hammond-pitch",
      osc: {
        id: "hammond-pitch",
        options: defaultOscOptions,
        type: "sine",
      },
      amount: 0.01,
      freq: 8,
      sync: false,
      target: "pitch",
    },
  ],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 3,
    gain: 0.1,
    transpose: 0,
  },
  oscillators: [
    {
      id: "1641318423999",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 1,
        octave: -1,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318592372",
      options: {
        balance: 0,
        coarse: -5,
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
    {
      id: "1641318633980",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 0.64,
        octave: 0,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318667373",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 0.6,
        octave: 1,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318710527",
      options: {
        balance: 0,
        coarse: 7,
        fine: 0,
        gain: 0.52,
        octave: 1,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318771731",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 0.5,
        octave: 2,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318808687",
      options: {
        balance: 0,
        coarse: 4,
        fine: 0,
        gain: 0.5,
        octave: 2,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318886397",
      options: {
        balance: 0,
        coarse: 7,
        fine: 0,
        gain: 0.49,
        octave: 2,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
    {
      id: "1641318936155",
      options: {
        balance: 0,
        coarse: 0,
        fine: 0,
        gain: 0.51,
        octave: 3,
        unison: 1,
        detuneU: 0.1,
        widthU: 0.1,
        phase: 0,
      },
      type: "sine",
    },
  ],
};
