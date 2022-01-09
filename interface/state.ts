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
  coarse: number;
  fine: number;
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
  coarse: 0,
  fine: 0,
  gain: 1,
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
export type OscType = Osc["type"];

export type FMOsc = {
  gain: number;
  ratio: number;
  type: OscType;
};

export type Filter = {
  shape: FilterShape;
  cutoff: number;
  Q: number;
  bellGain: number;
};

export type EnvelopeTarget =
  | "pitch"
  | "amplitude"
  | "cutoff"
  | "FMAmplitude"
  | "FMPitch";

export type Envelope = {
  amount: number;
  target: EnvelopeTarget;
  tension: number;
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
  feedback: number;
  length: number;
  mix: number;
  pingPong: number;
};

export type LFOTarget = "balance" | "pitch" | "amplitude" | "cutoff";

export type LFO = {
  id: string;
  amount: number;
  freq: number;
  osc: OscType;
  sync: boolean;
  target: LFOTarget;
};

export type Compressor = {
  attack: number;
  ratio: number;
  release: number;
  threshold: number;
};

export type Master = {
  dcOffset: number;
  /** In relative dB */
  EQHigh: number;
  /** In relative dB */
  EQLow: number;
  gain: number;
  /** In octaves */
  transpose: number;
  recording?: boolean;
};
};

export type UIState = {
  compressor: Compressor | undefined;
  delay: Delay | undefined;
  distortion: Distortion | undefined;
  envelopes: Envelope[];
  filter: Filter | undefined;
  FMOsc: FMOsc | undefined;
  LFOs: LFO[];
  master: Master;
  notes: Note[];
  oscillators: Osc[];
};

export type Preset = Omit<UIState, "notes"> & { displayName: string };

export const initialState: UIState = {
  compressor: undefined,
  delay: undefined,
  distortion: undefined,
  envelopes: [],
  filter: undefined,
  FMOsc: undefined,
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 0,
    gain: 0.5,
    transpose: 0,
  },
  notes: [],
  oscillators: [],
};
