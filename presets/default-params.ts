import { Preset } from "../interface/state";

export const defaultParams: Omit<Preset, "displayName"> = {
  ampEnv: undefined,
  delay: undefined,
  distortion: undefined,
  EQHigh: 0,
  EQLow: 0,
  filter: undefined,
  filterEnv: undefined,
  filterEnvAmt: 0,
  gain: 1,
  LFOs: [],
  oscillators: [],
  transpose: 0,
};
