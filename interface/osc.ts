import { FilterShape } from "../server/filter";

export type NoteName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Note = {
  name: NoteName;
  oct: Octave;
};

export type OscOptions = {
  detune: number;
};

export type Osc =
  | { type: "saw"; options: OscOptions }
  | { type: "square"; options: OscOptions }
  | { type: "sine"; options: OscOptions }
  | { type: "triangle"; options: OscOptions }
  | { type: "nesTriangle"; options: OscOptions & { samples: number } }
  | { type: "pulse"; options: OscOptions & { width: number } };

export type Filter = {
  shape: FilterShape;
  cutoff: number;
  Q: number;
  bellGain: number;
};

export type State = {
  filters: Filter[];
  notes: Note[];
  oscillators: Osc[];
};
