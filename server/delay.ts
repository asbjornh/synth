import { Delay } from "../interface/state";
import { Options } from "./player";
import { tape, TapeState } from "./tape";

export type DelayInstance = ReturnType<typeof delay>;

export const delay = (
  delay: Delay,
  options: Options,
  state?: { left: TapeState; right: TapeState }
) => {
  const numSamples =
    delay.pingPong > 0
      ? Math.round(delay.length * options.sampleRate * 2)
      : Math.round(delay.length * options.sampleRate);

  const left = tape(numSamples, state?.left);
  const right = tape(numSamples, state?.right);

  const tick = (channel: number): number => {
    if (delay.pingPong > 0) {
      const l = left.read(0);
      const r = right.read(0);
      const amp = 1 - delay.pingPong;

      if (channel === 0) {
        left.write(0, l * delay.feedback);
        left.tick();
        return l + r * amp;
      } else {
        right.write(0, r * delay.feedback);
        right.tick();
        return r + l * amp;
      }
    } else if (channel === 0) {
      const sample = left.read(0);
      left.write(0, sample * delay.feedback);
      left.tick();
      return sample;
    } else {
      const sample = right.read(0);
      right.write(0, sample * delay.feedback);
      right.tick();
      return sample;
    }
  };

  const write = (channel: number, sample: number) => {
    if (channel === 0) {
      const cur = left.read(-1);
      left.write(-1, cur + sample);
    } else {
      const offset = delay.pingPong > 0 ? Math.round(numSamples * 0.5) : -1;
      const cur = right.read(offset);
      right.write(offset, cur + sample);
    }
  };

  return {
    options: delay,
    tick,
    write,
    getState: () => ({ left: left.getState(), right: right.getState() }),
  };
};
