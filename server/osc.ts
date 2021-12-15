import { Note, Octave, Osc } from "../interface/state";
import { frequency } from "./frequencies";
import { clamp, mapRange } from "./util";

type OscFn = (t: number, freq: number) => number;

const toOct = (num: number) => clamp(Math.round(num), 0, 8) as Octave;

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

const applyDetune = (freq: number, cents: number) =>
  freq * Math.pow(2, cents / 1200);
const getGenerator = (osc: Osc): OscFn => {
  if (osc.type === "saw") return saw;
  if (osc.type === "nesTriangle") return nesTriangle;
  if (osc.type === "pulse") return pulse(0.5);
  if (osc.type === "sine") return sine;
  if (osc.type === "square") return pulse(0.5);
  if (osc.type === "triangle") return triangle;
  return osc;
};

export const oscillator = (osc: Osc) => {
  const { detune, octave } = osc.options;

  const generator = getGenerator(osc);
  return (t: number, note: Note) => {
    const adjustedNote =
      octave === 0 ? note : { ...note, oct: toOct(note.oct + octave) };
    const freq = frequency(adjustedNote);
    const adjustedFreq = detune === 0 ? freq : applyDetune(freq, detune);
    return osc.options.gain * generator(t, adjustedFreq);
  };
};
