import { Filter } from "../interface/state";

export type FilterShape =
  | "low-pass"
  | "band-pass"
  | "high-pass"
  | "notch"
  | "peak"
  | "all-pass"
  | "bell-pass"
  | "low-shelf"
  | "high-shelf";

export type FilterInstance = ReturnType<typeof filter>;

const getG = (
  shape: FilterShape,
  A: number,
  cutoff: number,
  sampleRate: number
) => {
  if (shape === "low-shelf")
    return Math.tan((Math.PI * cutoff) / sampleRate) / Math.sqrt(A);
  if (shape === "high-shelf")
    return Math.tan((Math.PI * cutoff) / sampleRate) * Math.sqrt(A);
  return Math.tan((Math.PI * cutoff) / sampleRate);
};

const toExponential = (cutoff: number) => Math.pow(2, cutoff);
const toLinear = (cutoff: number) => Math.log(cutoff) / Math.log(2);

/** Transform cutoff in linear space, resulting in a change in exponential space. */
export const adjustCutoff = (cutoff: number, delta: number) =>
  toExponential(toLinear(cutoff) + delta);

// https://www.cytomic.com/files/dsp/SvfLinearTrapOptimised2.pdf
export const filter = (
  sampleRate: number,
  options: Filter,
  state = { ic1eq: 0, ic2eq: 0 }
) => {
  const { bellGain: bellGainDB, cutoff, shape, Q } = options;

  let ic1eq = state.ic1eq;
  let ic2eq = state.ic2eq;

  const A = Math.pow(10, bellGainDB / 40);
  let k = 1 / Q;

  let g = getG(shape, A, cutoff, sampleRate);
  let a1 = 1 / (1 + g * (g + k));
  let a2 = g * a1;
  let a3 = g * a2;

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
    m0 = 1;
    m1 = k * (A - 1);
    m2 = A * A - 1;
  } else if (shape === "high-shelf") {
    m0 = A * A;
    m1 = k * (1 - A) * A;
    m2 = 1 - A * A;
  }

  const filterFn = (v0: number) => {
    const v3 = v0 - ic2eq;
    const v1 = a1 * ic1eq + a2 * v3;
    const v2 = ic2eq + a2 * ic1eq + a3 * v3;

    ic1eq = 2 * v1 - ic1eq;
    ic2eq = 2 * v2 - ic2eq;

    return m0 * v0 + m1 * v1 + m2 * v2;
  };

  filterFn.getState = () => ({ ic1eq, ic2eq });
  filterFn.setCutoff = (cutoff: number) => {
    g = getG(shape, A, cutoff, sampleRate);
    a1 = 1 / (1 + g * (g + k));
    a2 = g * a1;
    a3 = g * a2;
  };
  filterFn.getOptions = () => options;

  return filterFn;
};

export const getEQ = (
  sampleRate: number,
  shape: "high-shelf" | "low-shelf",
  gain: number,
  state = { ic1eq: 0, ic2eq: 0 }
): FilterInstance | undefined => {
  if (gain === 0) return;

  return filter(
    sampleRate,
    {
      shape,
      cutoff: shape === "high-shelf" ? 1500 : 150,
      bellGain: gain,
      Q: 1,
    },
    state
  );
};
