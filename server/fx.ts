import { Delay } from "../interface/state";
import { LQueue } from "./l-queue";
import { Options } from "./player";

export const distortion = (sample: number) =>
  sample > 0 ? 1 - Math.exp(-sample) : -1 + Math.exp(sample);

export type DelayInstance = ReturnType<typeof delay>;

export const delay = (
  delay: Delay,
  options: Options,
  state?: LQueue<number>
) => {
  const numSamples = delay.length * options.sampleRate;

  const samples = state?.length === numSamples ? state : new LQueue<number>();

  if (samples.length === 0) {
    samples.enqueueAll(Array.from<number>({ length: numSamples }).fill(0));
  }

  const tick = () => {
    const sample = samples.dequeue();
    return sample ?? 0;
  };

  const write = (sample: number) => {
    samples.enqueue(sample);
  };

  const getState = () => samples;

  return { options: delay, tick, write, getState };
};
