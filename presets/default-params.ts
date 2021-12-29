import { Preset } from "../interface/state";

export const defaultParams: Omit<Preset, "displayName"> = {
  ampEnv: undefined,
  distortion: undefined,
  filter: undefined,
  filterEnv: undefined,
  filterEnvAmt: 0,
  gain: 1,
  oscillators: [],
  transpose: 0,
};
