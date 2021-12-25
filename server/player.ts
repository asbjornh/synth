import { Readable } from "stream";
import { AudioIO } from "naudiodon";

import { filter } from "./filter";
import { clamp, map, mapO } from "./util";
import { Envelope, Note, State } from "../interface/state";
import { oscillator } from "./osc";
import { evalEnvelope } from "./envelope";

type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

type PlayerState = {
  ampEnv: Envelope | undefined;
  oscillators: ((t: number, note: Note) => number)[];
  notes: Partial<Record<Note, { start: number; end?: number }>>;
  /** Each element holds an array of filter functions per channel */
  filters: ((sample: number) => number)[][];
};

const gen = (
  numSamples: number,
  samplesGenerated: number,
  state: PlayerState,
  opts: Options,
  onSilent: (note: Note) => void
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
        mapO(state.notes, ({ start, end }, note) => {
          // TODO: Use t instead of time stamp
          const { value: amplitude, done } = state.ampEnv
            ? evalEnvelope(start, end, state.ampEnv)
            : { value: 1, done: end && Date.now() >= end };

          if (done) onSilent(note);
          out[channel][i] += amplitude * oscillator(t, note);
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

const toPlayerState = (
  cur: PlayerState,
  next: State,
  opts: Options
): PlayerState => {
  const oscillators = next.oscillators.map(oscillator);
  const filters = map(next.filters, (f) =>
    map(Array.from({ length: opts.channels }), (_) =>
      filter(f.shape, f.cutoff, f.Q, f.bellGain, opts.sampleRate)
    )
  );
  const nextNotes = { ...cur.notes };
  map(next.notes, (note) => {
    if (!nextNotes[note] || nextNotes[note]?.end) {
      nextNotes[note] = { start: Date.now() };
    }
  });
  mapO(nextNotes, (state, note) => {
    if (!state.end && !next.notes.includes(note)) {
      nextNotes[note] = { ...state, end: Date.now() };
    }
  });
  return { ampEnv: next.ampEnv, oscillators, notes: nextNotes, filters };
};

export const Player = (opts: Options) => {
  let state: PlayerState = {
    ampEnv: undefined,
    oscillators: [],
    notes: {},
    filters: [],
  };

  const onSilent = (note: Note) => {
    delete state.notes[note];
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

      if (
        state.oscillators.length === 0 ||
        Object.keys(state.notes).length === 0
      ) {
        this.push(buf);
        return;
      }

      const out = gen(numSamples, samplesGenerated, state, opts, onSilent);

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
  const io = AudioIO({
    outOptions: {
      channelCount: opts.channels,
      sampleFormat: opts.bitDepth,
      sampleRate: opts.sampleRate,
      framesPerBuffer: 512, // Magic number. Crashes if too low
    },
  });
  stream.pipe(io);
  io.start();

  return {
    setState: (next: State) => {
      state = toPlayerState(state, next, opts);
    },
    kill: () => {
      stream.destroy();
      io.quit();
    },
  };
};
