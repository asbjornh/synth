import { mapRange } from "../client/util";
import { Note } from "../interface/state";
import { evalEnvelope } from "./envelope";
import { frequencies } from "./frequencies";
import { distortion } from "./fx";
import { transpose } from "./osc";
import { Options, PlayerState } from "./player";
import { clamp, map, mapO } from "./util";

/** Stereo amplitude for the given channel */
const stereoAmplitude = (balance: number, channel: number) =>
  channel === 0
    ? 1 - Math.max(0, balance)
    : channel === 1
    ? 1 + Math.min(0, balance)
    : 1;

export const generateSample = (
  t: number,
  channel: number,
  state: PlayerState,
  options: Options,
  onSilent: (note: Note) => void
) => {
  const dt = 1 / options.sampleRate;
  let sample = 0;

  mapO(state.notes, ({ start, end, filter, LFOs, oscillators }, note) => {
    // NOTE: Sample contribution for single note
    let noteSample = 0;

    const pLFO = LFOs.pitch;
    const LFODetune = pLFO ? pLFO.osc(dt, pLFO.freq) * 1200 * pLFO.amount : 0;

    map(oscillators, (oscillator) => {
      const opts = oscillator.getOptions();
      const stereoAmp = stereoAmplitude(opts.balance, channel);

      const { value: envAmp, done } = state.ampEnv
        ? evalEnvelope(t, start, end, state.ampEnv)
        : { value: 1, done: end && t >= end };

      if (done) onSilent(note);

      const freq = frequencies[note] * transpose(state.transpose, LFODetune);

      noteSample += envAmp * stereoAmp * oscillator(dt, freq);
    });

    if (filter[channel]) {
      if (state.filterEnv && state.filterEnvAmt !== 0) {
        const opts = filter[channel].getOptions();
        const { value } = evalEnvelope(t, start, end, state.filterEnv);
        // NOTE: Using 2^x as cutoff curve
        const cutoff = Math.pow(
          2,
          Math.log(opts.cutoff) / Math.log(2) + state.filterEnvAmt * value
        );
        filter[channel].setCutoff(clamp(cutoff, 0, 10_000));
      }
      noteSample = filter[channel](noteSample);
    }

    if (state.distortion) {
      const { gain, mix, outGain } = state.distortion;
      const distMax = distortion(gain);
      const wet = (1 / distMax) * outGain * distortion(noteSample * gain);
      noteSample = mix * wet + (1 - mix) * noteSample;
    }

    const aLFO = LFOs.amplitude;
    if (aLFO) {
      const LFOamp = 1 + aLFO.osc(dt, aLFO.freq) * aLFO.amount;
      noteSample = noteSample * LFOamp;
    }

    sample += noteSample;
  });

  if (state.delay) {
    const { options } = state.delay;
    const wet = state.delay.tick();
    const mix = options.mix * wet + (1 - options.mix) * sample;
    state.delay.write(mix);
    return mix;
  }

  return sample;
};
