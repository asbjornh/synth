import { Readable } from "stream";
import Speaker from "speaker";

import { filter } from "./filter";
import { clamp, map } from "./util";
import { State } from "../interface/state";
import { frequency } from "./frequencies";
import { oscillator } from "./osc";

type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

type PlayerState = {
  oscillators: ((t: number, freq: number) => number)[];
  freqs: number[];
  /** Each element holds an array of filter functions per channel */
  filters: ((sample: number) => number)[][];
};

const gen = (
  numSamples: number,
  samplesGenerated: number,
  state: PlayerState,
  opts: Options
) => {
  const out: number[][] = map(
    Array.from({ length: opts.channels }),
    (_) => new Array(numSamples)
  );

  for (let i = 0; i < numSamples; i++) {
    for (let channel = 0; channel < opts.channels; channel++) {
      const t = (samplesGenerated + i) / opts.sampleRate;
      out[channel][i] = 0;
      map(state.oscillators, (oscillator) => {
        map(state.freqs, (freq) => {
          out[channel][i] += oscillator(t, freq);
        });
      });
      map(state.filters, (filters) => {
        if (filters[channel])
          out[channel][i] = filters[channel](out[channel][i]);
      });
    }
  }

  return out;
};

const toPlayerState = (next: State, opts: Options): PlayerState => {
  const oscillators = next.oscillators.map(oscillator);
  const freqs = next.notes.map(frequency);
  const filters = map(next.filters, (f) =>
    map(Array.from({ length: opts.channels }), (_) =>
      filter(f.shape, f.cutoff, f.Q, f.bellGain, opts.sampleRate)
    )
  );
  return { oscillators, freqs, filters };
};

export const Player = (opts: Options) => {
  let state: PlayerState = {
    oscillators: [],
    freqs: [],
    filters: [],
  };

  // NOTE: /2 because the range is centered around 0
  // NOTE: -1 to fix off-by-one issue
  const amplitude = Math.pow(2, opts.bitDepth) / 2 - 1;

  let samplesGenerated = 0;

  const stream = new Readable({
    read: function (chunkSize) {
      const sampleSize = opts.bitDepth / 8;
      const blockAlign = sampleSize * opts.channels;
      const numSamples = (chunkSize / blockAlign) | 0;
      const buf = Buffer.alloc(numSamples * blockAlign);

      if (state.oscillators.length === 0 || state.freqs.length === 0) {
        this.push(buf);
        return;
      }

      const out = gen(numSamples, samplesGenerated, state, opts);

      for (let i = 0; i < numSamples; i++) {
        for (let channel = 0; channel < opts.channels; channel++) {
          const val = amplitude * clamp(out[channel][i], -1, 1);
          const offset = i * sampleSize * opts.channels + channel * sampleSize;
          if (opts.bitDepth === 8) buf.writeInt8(val, offset);
          if (opts.bitDepth === 16) buf.writeInt16LE(val, offset);
          if (opts.bitDepth === 32) buf.writeInt32LE(val, offset);
        }
      }

      this.push(buf);

      samplesGenerated += numSamples;
    },
  });
  stream.pipe(new Speaker(opts));

  return {
    setState: (next: State) => {
      state = toPlayerState(next, opts);
    },
    kill: () => {
      stream.destroy();
    },
  };
};
