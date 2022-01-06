import {
  defaultOscOptions,
  FMOsc,
  Osc,
  OscOptions,
  OscType,
} from "../interface/state";
import { map, mapRange } from "./util";

type OscFn = (t: number, freq: number) => number;

const sine: OscFn = (t, freq) => Math.sin(Math.PI * 2 * freq * t);
const saw: OscFn = (t, freq) => 2 * ((t * freq) % 1) - 1;
const triangle: OscFn = (t, freq) => 2 * (Math.abs(saw(t, freq)) - 0.5);
const noise: OscFn = () => Math.random() * 2 - 1;
const pulse = (width: number) => (t: number, freq: number) =>
  (t * freq) % 1 < width ? -1 : 1;

const sampleFrom = (samples: number[]) => (t: number, freq: number) => {
  const i = Math.floor(((t * freq) % 1) * samples.length);
  return samples[i];
};

const sawSteps = (n: number) =>
  Array.from({ length: n }).map((_, i) => mapRange(i, [0, n - 1], [-1, 1]));

const triSteps = (n: number) => {
  const up = sawSteps(n);
  const down = up.slice(1, n * 2 - 1).reverse();
  return up.concat(down);
};

const nesTriangle = sampleFrom(triSteps(8));

const getGenerator = (osc: Osc): OscFn => {
  if (osc.type === "saw") return saw;
  if (osc.type === "nesTriangle") return nesTriangle;
  if (osc.type === "pulse") return pulse(osc.pulse.width);
  if (osc.type === "sine") return sine;
  if (osc.type === "square") return pulse(0.5);
  if (osc.type === "triangle") return triangle;
  if (osc.type === "noise") return noise;
  return osc;
};

export type OscillatorInstance = ReturnType<typeof oscillator>;

export const transpose = (octaves: number, cents: number) => {
  const detuneMultiplier = Math.pow(2, cents / 1200);
  if (octaves === 0) return detuneMultiplier;

  const octMagnitude = Math.pow(2, Math.abs(octaves));
  const octaveMultiplier = octaves < 0 ? 1 / octMagnitude : octMagnitude;
  return octaveMultiplier * detuneMultiplier;
};

export const defaultOsc = (type: OscType): Osc => {
  const oscBase = { id: "", options: defaultOscOptions };
  return type === "pulse"
    ? { ...oscBase, type, pulse: { width: 0.5 } }
    : type === "nesTriangle"
    ? { ...oscBase, type, nesTriangle: { samples: 16 } }
    : { ...oscBase, type };
};

export const oscillator = (osc: Osc, initialPhase?: number) => {
  let { coarse, fine, octave, gain, phase: pOffset } = osc.options;
  const cents = coarse * 100 + fine;

  const transpositionMultiplier = transpose(octave, cents);
  const generator = getGenerator(osc);

  let phase = initialPhase ?? 0;

  const oscFn = (dt: number, freq: number) => {
    const phaseDelta = (dt / (1 / freq)) % 1;
    phase += phaseDelta;
    const freq2 = freq * transpositionMultiplier;
    const t = phase / freq + pOffset * (1 / freq2);
    return gain * generator(t, freq2);
  };

  oscFn.getOsc = () => osc;
  oscFn.getOptions = () => osc.options;
  oscFn.getPhase = () => phase;

  return oscFn;
};

export const unison = (osc: Osc): OscillatorInstance[] => {
  const { options: opts } = osc;
  return map(Array.from({ length: opts.unison }), (_, i) => {
    const p = (i / opts.unison) * (i % 2 === 0 ? 1 : -1);
    const phase = Math.abs(p) * opts.unison * opts.phase;
    // TODO: Figure out how to correctly scale amplitude:
    const gain = (opts.gain * 1) / (opts.unison * 0.3);
    const balance = opts.balance + p * opts.widthU;
    const fine = opts.fine + p * opts.detuneU;

    return oscillator({
      ...osc,
      options: { ...osc.options, phase, gain, balance, fine },
    });
  });
};

export type FMOscillatorInstance = ReturnType<typeof FMOscillator>;

export const FMOscillator = (fmOsc: FMOsc, initialPhase?: number) => {
  const { type, ...rest } = fmOsc;
  return {
    osc: oscillator(defaultOsc(fmOsc.type), initialPhase),
    ...rest,
  };
};
