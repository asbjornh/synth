import { Note } from "../interface/state";
import { evalModulation } from "./eval-modulation";
import { adjustCutoff } from "./filter";
import { frequencies } from "./frequencies";
import { distortion } from "./fx";
import { transpose } from "./osc";
import { Options } from "./player";
import { PlayerState } from "./player-state";
import { clamp, forEachO } from "./util";

/** Stereo amplitude for the given channel */
const stereoAmplitude = (balance: number, channel: number) =>
  channel === 0
    ? 1 - Math.max(0, balance)
    : channel === 1
    ? 1 + Math.min(0, balance)
    : 1;

export const generateSample = (
  state: PlayerState,
  options: Options,
  onSilent: (note: Note) => void
): [number, number] => {
  const sample: [number, number] = [0, 0];
  const { master } = state;

  forEachO(state.notes, (noteState, note) => {
    const { filter, LFOs, envelopes, oscillators, released } = noteState;

    // NOTE: Sample contribution for single note
    const noteSample: [number, number] = [0, 0];
    const mod = evalModulation(state, note, noteState, 1 / options.sampleRate);

    if (mod.done) return onSilent(note);

    for (let channel = 0, l = sample.length; channel < l; channel++) {
      // NOTE: Only progress oscillator and envelope state once per multi-channel sample
      const dt = channel === 0 ? 1 / options.sampleRate : 0;

      for (let i = 0, l = oscillators.length; i < l; i++) {
        const oscillator = oscillators[i];
        const opts = oscillator.getOptions();
        const stereoAmp = stereoAmplitude(
          clamp(opts.balance + mod.balance, -1, 1),
          channel
        );

        const amp = mod.amplitude * stereoAmp;
        const freq = frequencies[note] * mod.detune * mod.FMdetune;
        noteSample[channel] += amp * oscillator(dt, freq);
      }

      if (filter[channel]) {
        const opts = filter[channel].getOptions();

        if (opts.cutoff !== mod.cutoff) {
          const cutoff = adjustCutoff(opts.cutoff, mod.cutoff);
          filter[channel].setCutoff(clamp(cutoff, 0, 10_000));
        }

        noteSample[channel] = filter[channel](noteSample[channel]);
      }

      if (state.distortion) {
        const { gain, mix, outGain } = state.distortion;
        const distMax = distortion(gain);
        const wet =
          (1 / distMax) * outGain * distortion(noteSample[channel] * gain);
        noteSample[channel] = mix * wet + (1 - mix) * noteSample[channel];
      }

      sample[channel] += noteSample[channel];
    }
  });

  for (let channel = 0, l = sample.length; channel < l; channel++) {
    sample[channel] += master.dcOffset;

    if (master.EQHigh) sample[channel] = master.EQHigh(sample[channel]);
    if (master.EQLow) sample[channel] = master.EQLow(sample[channel]);

    if (state.delay) {
      const { options } = state.delay;
      const wet = state.delay.tick(channel);
      const mix = options.mix * wet + (1 - options.mix) * sample[channel];
      state.delay.write(channel, sample[channel]);
      sample[channel] = mix;
    }

    sample[channel] *= state.master.gain;

    if (state.compressor) {
      sample[channel] *= state.compressor.getGain();
    }
  }

  state.compressor?.tick((sample[0] + sample[1]) / 2);

  return sample;
};
