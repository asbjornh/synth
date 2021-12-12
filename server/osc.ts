import { mapRange } from "./util";

type Osc = (t: number, freq: number) => number;

export const sine: Osc = (t, freq) => Math.sin(Math.PI * 2 * freq * t);
export const saw: Osc = (t, freq) => 2 * ((t * freq) % 1) - 1;
export const triangle: Osc = (t, freq) => 2 * (Math.abs(saw(t, freq)) - 0.5);
export const noise: Osc = () => Math.random() * 2 - 1;
export const pulse = (width: number) => (t: number, freq: number) =>
  (t * freq) % 1 < width ? -1 : 1;

const sampleFrom = (samples: number[]) => (t: number, freq: number) => {
  const i = Math.floor(((t * freq) % 1) * samples.length);
  return samples[i];
};

export const fromWord = (word: string) =>
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

export const nesTriangle = sampleFrom(triSteps(8));
export const nesSaw = sampleFrom(sawSteps(6));
