import { Envelope } from "../interface/state";
import { Options } from "./player";
import { mapRange } from "./util";

const ADS = (t: number, config: Envelope) => {
  const { A, D, S } = config;
  return t <= A
    ? mapRange(t, [0, A], [0, 1])
    : t <= A + D
    ? mapRange(t, [A, A + D], [1, S])
    : S;
};

const R = (endT: number, current: number, config: Envelope) =>
  Math.max(0, mapRange(endT, [0, config.R], [current, 0]));

export type EnvelopeInstance = ReturnType<typeof envelope>;

export const envelope = (config: Envelope, opts: Options) => {
  let t = 0;
  let endT = 0;
  let current = 0;

  return (released: boolean) => {
    const value = released ? R(endT, current, config) : ADS(t, config);

    const dt = 1 / opts.sampleRate;
    if (released) endT += dt;
    else current = value;
    t += dt;

    return { value, done: endT >= config.R };
  };
};
