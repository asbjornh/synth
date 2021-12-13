import { map } from "./util";

type Shape =
  | "low-pass"
  | "band-pass"
  | "high-pass"
  | "notch"
  | "peak"
  | "all-pass"
  | "bell-pass"
  | "low-shelf"
  | "high-shelf";

// https://www.cytomic.com/files/dsp/SvfLinearTrapOptimised2.pdf
export const filter = (
  shape: Shape,
  cutoff: number,
  Q: number,
  bellGainDB: number,
  sampleRate: number
) => {
  let ic1eq = 0;
  let ic2eq = 0;

  const A = Math.pow(10, bellGainDB / 40);
  let g = Math.tan((Math.PI * cutoff) / sampleRate);
  let k = 1 / Q;
  let m0: number;
  let m1: number;
  let m2: number;

  if (shape === "low-pass") {
    m0 = 0;
    m1 = 0;
    m2 = 1;
  } else if (shape === "band-pass") {
    m0 = 0;
    m1 = 1;
    m2 = 0;
  } else if (shape === "high-pass") {
    m0 = 1;
    m1 = -k;
    m2 = -1;
  } else if (shape === "notch") {
    m0 = 1;
    m1 = -k;
    m2 = 0;
  } else if (shape === "peak") {
    m0 = 1;
    m1 = -k;
    m2 = -2;
  } else if (shape === "all-pass") {
    m0 = 1;
    m1 = -2 * k;
    m2 = 0;
  } else if (shape === "bell-pass") {
    k = 1 / (Q * A);
    m0 = 1;
    m1 = k * (A * A - 1);
    m2 = 0;
  } else if (shape === "low-shelf") {
    g = Math.tan((Math.PI * cutoff) / sampleRate) / Math.sqrt(A);
    m0 = 1;
    m1 = k * (A - 1);
    m2 = A * A - 1;
  } else if (shape === "high-shelf") {
    g = Math.tan((Math.PI * cutoff) / sampleRate) * Math.sqrt(A);
    m0 = A * A;
    m1 = k * (1 - A) * A;
    m2 = 1 - A * A;
  }

  const a1 = 1 / (1 + g * (g + k));
  const a2 = g * a1;
  const a3 = g * a2;

  return (v0: number) => {
    const v3 = v0 - ic2eq;
    const v1 = a1 * ic1eq + a2 * v3;
    const v2 = ic2eq + a2 * ic1eq + a3 * v3;

    ic1eq = 2 * v1 - ic1eq;
    ic2eq = 2 * v2 - ic2eq;

    return m0 * v0 + m1 * v1 + m2 * v2;
  };
};
