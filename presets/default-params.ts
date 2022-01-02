import { Preset } from "../interface/state";
import { initialState } from "../interface/state";

const { notes, ...params } = initialState;

export const defaultParams: Omit<Preset, "displayName"> = params;
