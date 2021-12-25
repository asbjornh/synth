import { Envelope } from "../interface/state";
import { mapRange } from "./util";

export const evalEnvelope = (
  startTime: number,
  endTime: number | undefined,
  config: Envelope
): { value: number; done?: boolean } => {
  const { A, D, S, R } = config;
  if (endTime) {
    const delta = Date.now() - endTime;
    return {
      value: Math.max(0, mapRange(delta, [0, R], [S, 0])),
      done: delta >= R,
    };
  }
  const delta = Date.now() - startTime;
  if (delta <= A) return { value: mapRange(delta, [0, A], [0, 1]) };
  if (delta <= A + D) return { value: mapRange(delta, [A, A + D], [1, S]) };
  return { value: S };
};
