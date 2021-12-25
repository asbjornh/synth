import { FilterShape } from "../server/filter";

export type PitchClass =
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

export type Note = `${PitchClass}${Octave}`;

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

export type Saw = Oscillator<"saw">;
export type Square = Oscillator<"square">;
export type Sine = Oscillator<"sine">;
export type Triangle = Oscillator<"triangle">;
export type NesTriangle = Oscillator<"nesTriangle"> & {
  nesTriangle: { samples: number };
};
export type Pulse = Oscillator<"pulse"> & { pulse: { width: number } };

export type Osc = Saw | Square | Sine | Triangle | NesTriangle | Pulse;

export type Filter = {
  shape: FilterShape;
  cutoff: number;
  Q: number;
  bellGain: number;
};

export type Envelope = {
  /** Attack duration */
  A: number;
  /** Decay duration */
  D: number;
  /** Sustain level */
  S: number;
  /** Release duration */
  R: number;
};

export type State = {
  ampEnv: Envelope | undefined;
  filter: Filter | undefined;
  filterEnv: Envelope | undefined;
  filterEnvAmt: number;
  notes: Note[];
  oscillators: Osc[];
};

export const initialState: State = {
  ampEnv: undefined,
  filter: undefined,
  filterEnv: undefined,
  filterEnvAmt: 0,
  notes: [],
  oscillators: [],
};
