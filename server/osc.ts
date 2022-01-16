import {
  defaultOscOptions,
  FMOsc,
  Osc,
  OscOptions,
  OscType,
} from "../interface/state";
import { FMModulation, FMOscillator, FMOscillatorInstance } from "./fm";
import { randoms } from "./random";
import { forEach, isOdd, map, mapRange } from "./util";

type OscFn = (t: number, freq: number) => number;

export const sine: OscFn = (t, freq) => Math.sin(Math.PI * 2 * freq * t);
const saw: OscFn = (t, freq) => 2 * ((t * freq) % 1) - 1;
const triangle: OscFn = (t, freq) => 2 * (Math.abs(saw(t, freq)) - 0.5);
export const noise: OscFn = () => Math.random() * 2 - 1;
const pulse = (width: number) => (t: number, freq: number) =>
  (t * freq) % 1 < width ? -1 : 1;

const sampleFrom = (samples: number[]) => (t: number, freq: number) => {
  const i = Math.floor(((t * freq) % 1) * samples.length);
  const sample = i >= 0 ? samples[i] : samples[samples.length + i];
  if (sample === undefined) console.error("sampleFrom: undefined");
  return sample;
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

export const oscillator = (
  osc: Osc,
  index: number,
  FMoscs: FMOscillatorInstance[],
  initialPhase?: number
) => {
  let { coarse, fine, octave, gain, phase: pOffset } = osc.options;
  const cents = coarse * 100 + fine;

  const transpositionMultiplier = transpose(octave, cents);
  const generator = getGenerator(osc);

  let phase = initialPhase ?? 0;

  const oscFn = (dt: number, freq: number, FMmod?: FMModulation): number => {
    const freq2 = freq * transpositionMultiplier;

    let FMdetune = 1;

    forEach(FMoscs, (osc) => {
      FMdetune += osc(dt, freq2, FMmod || {});
    });

    const freq3 = freq2 * FMdetune;
    const t = phase / freq3 + pOffset * (1 / freq3);

    const phaseDelta = (dt / (1 / freq3)) % 1;
    phase += phaseDelta;

    return gain * generator(t, freq3);
  };

  oscFn.getPhase = () => phase;
  oscFn.config = osc;
  oscFn.FMoscs = FMoscs;
  oscFn.index = index;

  return oscFn;
};

const unisonParamAmount = (unison: number, i: number) => {
  const direction = isOdd(i) ? 1 : -1;
  if (isOdd(unison)) {
    if (i === 0) return 0;
    return 2 * ((1 + Math.floor(i / 3)) / (unison - 1)) * direction;
  } else {
    return 2 * ((1 + Math.floor(i / 2)) / unison) * direction;
  }
};

export const unison = (
  osc: Osc,
  index: number,
  FMoscs: (FMOsc & { index: number })[]
): OscillatorInstance[] => {
  const { options: opts } = osc;
  return map(Array.from({ length: opts.unison }), (_, i) => {
    const n = unisonParamAmount(opts.unison, i);
    const r = i >= 7 ? randoms[i % randoms.length] ?? 1 : 1;
    const phase = n * opts.phase * r;
    // TODO: Figure out how to correctly scale amplitude:
    const gain = opts.gain / (opts.unison * 0.3);
    const balance = opts.balance + n * opts.widthU;
    const fine = opts.fine + n * opts.detuneU;

    return oscillator(
      {
        ...osc,
        options: { ...opts, phase, gain, balance, fine },
      },
      index,
      map(FMoscs, (osc) => FMOscillator(osc))
    );
  });
};
