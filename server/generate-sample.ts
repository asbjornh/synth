import { Note } from "../interface/state";
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
    const modT = 1 / options.sampleRate;

    const { filter, FMOsc, LFOs, envelopes, oscillators, released, velocity } =
      noteState;

    // NOTE: Sample contribution for single note
    const noteSample: [number, number] = [0, 0];

    const veloAmp = clamp(
      velocity * state.velocity.scale + state.velocity.offset,
      0,
      1
    );

    const pLFO = LFOs.pitch;
    const LFODetune = pLFO ? pLFO.osc(modT, pLFO.freq) * 1200 * pLFO.amount : 0;

    const aLFO = LFOs.amplitude;
    const LFOamp = aLFO ? 1 + aLFO.osc(modT, aLFO.freq) * aLFO.amount : 1;

    const pitch = envelopes.pitch?.(modT, released).value ?? 1;
    const envDetune =
      (1 - pitch) * 1200 * (envelopes.pitch?.config.amount ?? 0);

    const { value: envAmp, done } = envelopes.amplitude
      ? envelopes.amplitude(modT, released)
      : { value: 1, done: released };

    const FMPitch = envelopes.FMPitch?.(modT, released).value ?? 0;
    const FMEnvDetune = (1 - FMPitch) * (envelopes.FMPitch?.config.amount ?? 0);
    const FMEnvAmp = envelopes.FMAmplitude?.(modT, released).value ?? 1;

    const freq =
      frequencies[note] * transpose(master.transpose, LFODetune + envDetune);

    const FMdetune = FMOsc
      ? 1 +
        FMOsc.gain *
          FMEnvAmp *
          FMOsc.osc(modT, freq * (FMOsc.ratio + FMEnvDetune))
      : 1;

    const bLFO = LFOs.balance;
    const LFObalance = bLFO ? bLFO.osc(modT, bLFO.freq) * bLFO.amount : 0;

    for (
      let channel = 0, l = sample.length;
      channel < sample.length;
      channel++
    ) {
      // NOTE: Only progress oscillator and envelope state once per multi-channel sample
      const dt = channel === 0 ? 1 / options.sampleRate : 0;

      for (let i = 0, l = oscillators.length; i < l; i++) {
        const oscillator = oscillators[i];
        const opts = oscillator.getOptions();
        const stereoAmp = stereoAmplitude(
          clamp(opts.balance + LFObalance, -1, 1),
          channel
        );
        const amp = envAmp * stereoAmp * veloAmp * LFOamp;

        if (done) onSilent(note);

        noteSample[channel] += amp * oscillator(dt, freq * FMdetune);
      }

      if (filter[channel]) {
        const opts = filter[channel].getOptions();
        const cLFO = LFOs.cutoff;
        const LFOcutoff = cLFO ? cLFO.osc(dt, cLFO.freq) * cLFO.amount * 10 : 0;

        if (envelopes.cutoff && envelopes.cutoff.config.amount !== 0) {
          const { value } = envelopes.cutoff(dt, released);
          const cutoff = adjustCutoff(
            opts.cutoff,
            envelopes.cutoff.config.amount * value + LFOcutoff
          );
          filter[channel].setCutoff(clamp(cutoff, 0, 10_000));
        } else if (cLFO) {
          const cutoff = adjustCutoff(opts.cutoff, LFOcutoff);
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

  state.compressor?.tick(sample[0] + sample[1] / 2);

  return sample;
};
