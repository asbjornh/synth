import { Readable } from "stream";
import { AudioIO } from "naudiodon";

import { filter, FilterInstance } from "./filter";
import { clamp, map, mapO } from "./util";
import {
  Distortion,
  Envelope,
  Filter,
  LFOTarget,
  Note,
  State,
} from "../interface/state";
import { oscillator, OscillatorInstance, transpose, unison } from "./osc";
import { generateSample } from "./generate-sample";
import { delay, DelayInstance } from "./fx";
import { fromEntries } from "../client/util";
import { frequencies } from "./frequencies";

export type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

type NoteState = {
  /** Start time */
  start: number;
  /** End time */
  end?: number;
  LFOs: Record<LFOTarget, LFOInstance | undefined>;
  oscillators: OscillatorInstance[];
  /** One filter instance per channel */
  filter: FilterInstance[];
};

type LFOInstance = {
  osc: OscillatorInstance;
  amount: number;
  freq: number;
};

export type PlayerState = {
  ampEnv: Envelope | undefined;
  delay: DelayInstance | undefined;
  distortion: Distortion | undefined;
  filterEnv: Envelope | undefined;
  filterEnvAmt: number;
  gain: number;
  notes: Partial<Record<Note, NoteState>>;
  /** In octaves */
  transpose: number;
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
  const f = next.filter;
  const notes = { ...cur.notes };
  map(next.notes, (note) => {
    if (!notes[note] || notes[note]?.end) {
      notes[note] = {
        start: t,
        filter: [],
        end: undefined,
        LFOs: {
          amplitude: undefined,
          cutoff: undefined,
          pitch: undefined,
        },
        oscillators: [],
      };
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

    const curOscillators = notes[note]?.oscillators || [];
    const nextOscs = next.oscillators.flatMap((osc) =>
      osc.options.unison === 1 ? [oscillator(osc)] : unison(osc)
    );

    const oscillators =
      curOscillators.length === nextOscs.length
        ? map(nextOscs, (osc, index) =>
            oscillator(osc.getOsc(), curOscillators[index].getPhase())
          )
        : nextOscs;

    const nextLFOs = fromEntries(
      next.LFOs.map<[LFOTarget, LFOInstance]>((LFO) => {
        const phase = LFO.sync ? undefined : t / (1 / LFO.freq);
        const osc = state.LFOs[LFO.target]?.osc || oscillator(LFO.osc, phase);

        return [LFO.target, { osc, amount: LFO.amount, freq: LFO.freq }];
      })
    );

    notes[note] = {
      ...state,
      end,
      filter: nextFilter,
      LFOs: nextLFOs,
      oscillators,
    };
  });

  const nextDelay = next.delay
    ? delay(next.delay, opts, cur.delay?.getState())
    : undefined;

  return {
    ampEnv: next.ampEnv,
    delay: nextDelay,
    distortion: next.distortion,
    filterEnv: next.filterEnv,
    filterEnvAmt: next.filterEnvAmt,
    gain: next.gain,
    notes: notes,
    transpose: next.transpose,
  };
};

export const Player = (opts: Options) => {
  let state: PlayerState = {
    ampEnv: undefined,
    delay: undefined,
    distortion: undefined,
    filterEnv: undefined,
    filterEnvAmt: 0,
    gain: 1,
    notes: {},
    transpose: 0,
  };

  let onFrame: (samples: number[], t: number) => void = () => {};

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
      const samples = new Array();

      for (let i = 0; i < numSamples; i++) {
        for (let channel = 0; channel < opts.channels; channel++) {
          const t = (samplesGenerated + i) / opts.sampleRate;
          const sample = clamp(
            state.gain * generateSample(t, channel, state, opts, onSilent),
            -1,
            1
          );
          if (channel === 0) {
            samples.push(sample / 2);
          } else {
            samples[i] = samples[i] + sample / 2;
          }
          const val = amplitude * sample;
          const offset = i * sampleSize * opts.channels + channel * sampleSize;
          if (opts.bitDepth === 8) buf.writeInt8(val, offset);
          if (opts.bitDepth === 16) buf.writeInt16LE(val, offset);
          if (opts.bitDepth === 32) buf.writeInt32LE(val, offset);
        }
      }

      onFrame(samples, samplesGenerated / opts.sampleRate);
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
      closeOnError: false,
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
    onFrame: (fn: (frames: number[], t: number) => void) => {
      onFrame = fn;
    },
    kill: () => {
      stream.destroy();
      io.quit();
    },
  };
};
