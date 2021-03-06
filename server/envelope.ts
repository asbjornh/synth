import { Envelope } from "../interface/state";

const ADS = (t: number, config: Envelope) => {
  const { A, D, S } = config;
  return A > 0 && t <= A
    ? interpolate(t / A, config.tension) * (D > 0 ? 1 : S)
    : D > 0 && t <= A + D
    ? 1 - interpolate((t - A) / D, -config.tension) * (1 - S)
    : S;
};

const R = (endT: number, current: number, config: Envelope) =>
  current * (1 - interpolate(endT / config.R, -config.tension));

const interpolate = (value: number, tension: number) =>
  tension > 0
    ? Math.pow(value, 1 + tension)
    : Math.pow(value, 1 / (1 + Math.abs(tension)));

export type EnvelopeInstance = ReturnType<typeof envelope>;

export const envelope = (
  config: Envelope,
  state = { t: 0, endT: 0, current: 0 }
) => {
  let t = state.t;
  let endT = state.endT;
  let current = state.current;

  const envFn = (dt: number, released: boolean) => {
    const value = released ? R(endT, current, config) : ADS(t, config);

    if (released) endT += dt;
    else current = value;
    t += dt;

    return { value, done: endT > config.R };
  };

  envFn.getState = () => ({ t, endT, current });
  envFn.config = config;

  return envFn;
};
