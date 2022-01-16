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

export type FMTarget = "0" | "1" | "2";
export type FMOsc = {
  id: string;
  gain: number;
  ratio: number;
  target: FMTarget;
  type: "sine" | "noise";
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
  | "FM_0_amp"
  | "FM_0_pitch"
  | "FM_1_amp"
  | "FM_1_pitch"
  | "FM_2_amp"
  | "FM_2_pitch";

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

export type NoteDescriptor = { note: Note; velocity: number };

export type VelocityTarget =
  | "amplitude"
  | "cutoff"
  | "FM_0_amplitude"
  | "FM_1_amplitude"
  | "FM_2_amplitude";

export type Velocity = {
  scale: number;
  offset: number;
  /** Static velocity of virtual keyboard */
  virtual: number;
  targets: Partial<Record<VelocityTarget, number>>;
};

export type UIState = {
  compressor: Compressor | undefined;
  delay: Delay | undefined;
  distortion: Distortion | undefined;
  envelopes: Envelope[];
  filter: Filter | undefined;
  FMOscs: FMOsc[];
  LFOs: LFO[];
  master: Master;
  oscillators: Osc[];
  velocity: Velocity;
};

export type Preset = UIState & { displayName: string };

export const initialState: UIState = {
  compressor: undefined,
  delay: undefined,
  distortion: undefined,
  envelopes: [],
  filter: undefined,
  FMOscs: [],
  LFOs: [],
  master: {
    dcOffset: 0,
    EQHigh: 0,
    EQLow: 0,
    gain: 0.5,
    transpose: 0,
  },
  oscillators: [],
  velocity: {
    scale: 1,
    offset: 0,
    virtual: 1,
    targets: {
      amplitude: 1,
    },
  },
};
