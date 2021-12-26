import { Readable } from "stream";
import { AudioIO } from "naudiodon";

import { filter, FilterInstance } from "./filter";
import { clamp, map, mapO } from "./util";
import { Envelope, Filter, Note, State } from "../interface/state";
import { oscillator, OscillatorInstance } from "./osc";
import { evalEnvelope } from "./envelope";
import { mapRange } from "../client/util";

type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

type NoteState = {
  /** Start time */
  start: number;
  /** End time */
  end?: number;
  /** One filter instance per channel */
  filter: FilterInstance[];
};

type PlayerState = {
  ampEnv: Envelope | undefined;
  filterEnv: Envelope | undefined;
  filterEnvAmt: number;
  notes: Partial<Record<Note, NoteState>>;
  oscillators: OscillatorInstance[];
};

const generateSample = (
  t: number,
  channel: number,
  state: PlayerState,
  onSilent: (note: Note) => void
) => {
  let sample = 0;

  mapO(state.notes, ({ start, end, filter }, note) => {
    map(state.oscillators, (oscillator) => {
      const opts = oscillator.getOptions();

      const balanceMultiplier =
        channel === 0
          ? 1 - Math.max(0, opts.balance)
          : channel === 1
          ? 1 + Math.min(0, opts.balance)
          : 1;

      const { value: amplitude, done } = state.ampEnv
        ? evalEnvelope(t, start, end, state.ampEnv)
        : { value: 1, done: end && t >= end };

      if (done) onSilent(note);
      sample += amplitude * balanceMultiplier * oscillator(t, note);
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
      sample = filter[channel](sample);
    }
  });

  return sample;
};

const filterInit = (opts: Options, filterOpts: Filter | undefined) =>
  filterOpts
    ? map(Array.from({ length: opts.channels }), (_) =>
        filter(opts.sampleRate, filterOpts)
      )
    : [];

const toPlayerState = (
  cur: PlayerState,
  next: State,
  opts: Options,
  t: number
): PlayerState => {
  const oscillators = next.oscillators.map(oscillator);
  const f = next.filter;
  const notes = { ...cur.notes };
  map(next.notes, (note) => {
    if (!notes[note] || notes[note]?.end) {
      notes[note] = { start: t, filter: [], end: undefined };
    }
  });
  mapO(notes, (state, note) => {
    const end = state.end || (next.notes.includes(note) ? undefined : t);

    const nextFilter =
      f && state.filter.length > 0
        ? map(state.filter, (instance) =>
            filter(opts.sampleRate, f, instance.getState())
          )
        : filterInit(opts, f);

    notes[note] = { ...state, end, filter: nextFilter };
  });
  return {
    ampEnv: next.ampEnv,
    filterEnv: next.filterEnv,
    filterEnvAmt: next.filterEnvAmt,
    notes: notes,
    oscillators,
  };
};

export const Player = (opts: Options) => {
  let state: PlayerState = {
    ampEnv: undefined,
    filterEnv: undefined,
    filterEnvAmt: 0,
    notes: {},
    oscillators: [],
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

      for (let i = 0; i < numSamples; i++) {
        for (let channel = 0; channel < opts.channels; channel++) {
          const t = (samplesGenerated + i) / opts.sampleRate;
          const sample = generateSample(t, channel, state, onSilent);
          const val = amplitude * clamp(sample, -1, 1);
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
      state = toPlayerState(
        state,
        next,
        opts,
        samplesGenerated / opts.sampleRate
      );
    },
    kill: () => {
      stream.destroy();
      io.quit();
    },
  };
};
