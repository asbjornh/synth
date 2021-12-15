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
  octave: number;
  gain: number;
};

type Oscillator<Type extends string> = {
  id: string;
  type: Type;
  options: OscOptions;
};

export type Osc =
  | Oscillator<"saw">
  | Oscillator<"square">
  | Oscillator<"sine">
  | Oscillator<"triangle">
  | (Oscillator<"nesTriangle"> & { nesTriangle: { samples: number } })
  | (Oscillator<"pulse"> & { pulse: { width: number } });

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
