import { Compressor } from "../interface/state";
import { Options } from "./player";

import { tape, TapeState } from "./tape";

const size = 400;

export type CompressorInstance = ReturnType<typeof compressor>;

export const compressor = (
  config: Compressor,
  opts: Options,
  state?: TapeState
) => {
  const { attack, ratio, release, threshold } = config;

  const samples = tape(size, state);

  let gain = 1;

  const tick = (sample: number) => {
    samples.tick();
    samples.write(0, sample);

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
  };

  const getGain = () => gain;
  const getSamples = () => samples.getState();

  return { getGain, getSamples, tick };
};
