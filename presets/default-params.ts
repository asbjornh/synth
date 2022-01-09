import { Preset } from "../interface/state";
import { initialState } from "../interface/state";

export const defaultParams: Omit<Preset, "displayName"> = initialState;
