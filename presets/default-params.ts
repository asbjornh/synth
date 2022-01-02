import { Preset } from "../interface/state";

export const defaultParams: Omit<Preset, "displayName"> = {
  compressor: undefined,
  delay: undefined,
  distortion: undefined,
  envelopes: [],
  EQHigh: 0,
  EQLow: 0,
  filter: undefined,
  gain: 1,
  LFOs: [],
  oscillators: [],
  transpose: 0,
};
