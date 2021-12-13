import { FilterShape } from "../server/filter";

export type Osc =
  | { type: "saw" }
  | { type: "square" }
  | { type: "sine" }
  | { type: "triangle" }
  | { type: "nesTriangle"; options: { samples: number } }
  | { type: "pulse"; options: { width: number } };

export type Filter = {
  shape: FilterShape;
  cutoff: number;
  Q: number;
  bellGain: number;
};

export type State = {
  oscillators: Osc[];
  filters: Filter[];
};
