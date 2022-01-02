import { Note } from "../interface/state";
import { adjustCutoff } from "./filter";
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

  mapO(
    state.notes,
    ({ filter, LFOs, envelopes, oscillators, released }, note) => {
      // NOTE: Sample contribution for single note
      let noteSample = 0;

      const pLFO = LFOs.pitch;
      const LFODetune = pLFO ? pLFO.osc(dt, pLFO.freq) * 1200 * pLFO.amount : 0;

      const { value: envAmp, done } = envelopes.amplitude
        ? envelopes.amplitude(released)
        : { value: 1, done: released };

      map(oscillators, (oscillator) => {
        const opts = oscillator.getOptions();
        const stereoAmp = stereoAmplitude(opts.balance, channel);

        if (done) onSilent(note);

        const freq = frequencies[note] * transpose(state.transpose, LFODetune);

        noteSample += envAmp * stereoAmp * oscillator(dt, freq);
      });

      if (filter[channel]) {
        const opts = filter[channel].getOptions();
        const cLFO = LFOs.cutoff;
        const LFOcutoff = cLFO ? cLFO.osc(dt, cLFO.freq) * cLFO.amount * 10 : 0;

        if (envelopes.cutoff && envelopes.cutoff.config.amount !== 0) {
          const { value } = envelopes.cutoff(released);
          const cutoff = adjustCutoff(
            opts.cutoff,
            envelopes.cutoff.config.amount * value + LFOcutoff
          );
          filter[channel].setCutoff(clamp(cutoff, 0, 10_000));
        } else if (cLFO) {
          const cutoff = adjustCutoff(opts.cutoff, LFOcutoff);
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
    }
  );

  if (state.EQHigh) sample = state.EQHigh(sample);
  if (state.EQLow) sample = state.EQLow(sample);

  if (state.delay) {
    const { options } = state.delay;
    const wet = state.delay.tick();
    const mix = options.mix * wet + (1 - options.mix) * sample;
    state.delay.write((wet + sample) * options.feedback);
    return mix;
  }

  return sample;
};
