import { Note, Osc } from "../interface/state";
import { frequencies } from "./frequencies";
import { mapRange } from "./util";

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

const fromWord = (word: string) =>
  sampleFrom(
    word
      .split("")
      .map((c) => c.charCodeAt(0))
      .map((c) => mapRange(c, [65, 122], [-1, 1]))
  );

const sawSteps = (n: number) =>
  Array.from({ length: n }).map((_, i) => mapRange(i, [0, n - 1], [-1, 1]));

const triSteps = (n: number) => {
  const up = sawSteps(n);
  const down = up.slice(1, 15).reverse();
  return up.concat(down);
};

const nesTriangle = sampleFrom(triSteps(8));
const nesSaw = sampleFrom(sawSteps(6));

const getGenerator = (osc: Osc): OscFn => {
  if (osc.type === "saw") return saw;
  if (osc.type === "nesTriangle") return nesTriangle;
  if (osc.type === "pulse") return pulse(osc.pulse.width);
  if (osc.type === "sine") return sine;
  if (osc.type === "square") return pulse(0.5);
  if (osc.type === "triangle") return triangle;
  return osc;
};

export const oscillator = (osc: Osc) => {
  const { detune, octave } = osc.options;

  const octMagnitude = Math.pow(2, Math.abs(octave));
  const octaveMultiplier =
    octave === 0 ? 1 : octave < 0 ? 1 / octMagnitude : octMagnitude;
  const detuneMultiplier = Math.pow(2, detune / 1200);

  const generator = getGenerator(osc);

  return (t: number, note: Note) => {
    const freq = frequencies[note] * octaveMultiplier * detuneMultiplier;
    return osc.options.gain * generator(t, freq);
  };
};
