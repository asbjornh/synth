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
  balance: number;
  detune: number;
  gain: number;
  octave: number;
  phase: number;
  unison: number;
  /** Unison detune */
  detuneU: number;
  /** Stereo width for unison */
  widthU: number;
};

// NOTE: Do not change these values. The system presets might depend on them
export const defaultOscOptions: OscOptions = {
  balance: 0,
  gain: 1,
  detune: 0,
  octave: 0,
  phase: 0,
  unison: 1,
  detuneU: 0.1,
  widthU: 0.1,
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
export type Noise = Oscillator<"noise">;

export type Osc = Saw | Square | Sine | Triangle | NesTriangle | Pulse | Noise;

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

export type Distortion = {
  mix: number;
  gain: number;
  outGain: number;
};

export type Delay = {
  length: number;
  mix: number;
  feedback: number;
};

export type LFOTarget = "pitch" | "amplitude" | "cutoff";

export type LFO = {
  id: string;
  amount: number;
  freq: number;
  osc: Osc;
  sync: boolean;
  target: LFOTarget;
};

export type State = {
  ampEnv: Envelope | undefined;
  delay: Delay | undefined;
  distortion: Distortion | undefined;
  filter: Filter | undefined;
  filterEnv: Envelope | undefined;
  filterEnvAmt: number;
  gain: number;
  LFOs: LFO[];
  notes: Note[];
  oscillators: Osc[];
  /** In octaves */
  transpose: number;
};

export type Preset = Omit<State, "notes"> & { displayName: string };

export const initialState: State = {
  ampEnv: undefined,
  delay: undefined,
  distortion: undefined,
  filter: undefined,
  filterEnv: undefined,
  filterEnvAmt: 0,
  gain: 1,
  LFOs: [],
  notes: [],
  oscillators: [],
  transpose: 0,
};
