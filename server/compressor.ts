import { Compressor } from "../interface/state";
import { LQueue } from "./l-queue";
import { Options } from "./player";

const size = 400;

export type CompressorInstance = ReturnType<typeof compressor>;

export const compressor = (
  config: Compressor,
  opts: Options,
  state?: LQueue<number>
) => {
  const { attack, ratio, release, threshold } = config;

  const samples = state || new LQueue<number>();

  if (samples.length === 0) {
    samples.enqueueAll(Array.from<number>({ length: size }).fill(0));
  }

  let gain = 1;

  const tick = (sample: number) => {
    samples.enqueue(sample);

    let squareSum = 0;
    samples.forEach((sample) => {
      squareSum += Math.pow(sample ?? 0, 2);
    });
    const rms = Math.sqrt(squareSum / size);

    const targetGain =
      rms > threshold ? threshold + (rms - threshold) / ratio : 1;

    if (targetGain < gain) {
      if (attack === 0) {
        gain = targetGain;
      } else {
        gain += (targetGain - gain) / (attack * opts.sampleRate);
      }
    } else {
      if (release === 0) {
        gain = targetGain;
      } else {
        gain += (targetGain - gain) / (release * opts.sampleRate);
      }
    }

    return samples.dequeue();
  };

  const getGain = () => gain;
  const getSamples = () => samples;

  return { getGain, getSamples, tick };
};
