import { Readable } from "stream";
import { AudioIO } from "naudiodon";

import { filter, FilterInstance, getEQ } from "./filter";
import { clamp, map, mapO } from "./util";
import {
  defaultOscOptions,
  Distortion,
  EnvelopeTarget,
  Filter,
  LFOTarget,
  Note,
  UIState,
} from "../interface/state";
import {
  defaultOsc,
  FMOscillator,
  FMOscillatorInstance,
  oscillator,
  OscillatorInstance,
  unison,
} from "./osc";
import { generateSample } from "./generate-sample";
import { delay, DelayInstance } from "./delay";
import { fromEntries } from "../client/util";
import { envelope, EnvelopeInstance } from "./envelope";
import { compressor, CompressorInstance } from "./compressor";

export type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

type NoteState = {
  envelopes: Record<EnvelopeTarget, EnvelopeInstance | undefined>;
  FMOsc: FMOscillatorInstance | undefined;
  LFOs: Record<LFOTarget, LFOInstance | undefined>;
  oscillators: OscillatorInstance[];
  /** One filter instance per channel */
  filter: FilterInstance[];
  released: boolean;
};

type LFOInstance = {
  osc: OscillatorInstance;
  amount: number;
  freq: number;
};

export type PlayerState = {
  compressor: CompressorInstance | undefined;
  delay: DelayInstance | undefined;
  distortion: Distortion | undefined;
  master: {
    dcOffset: number;
    EQHigh: FilterInstance | undefined;
    EQLow: FilterInstance | undefined;
    gain: number;
    /** In octaves */
    transpose: number;
  };
  notes: Partial<Record<Note, NoteState>>;
};

const filterInit = (opts: Options, filterOpts: Filter | undefined) =>
  filterOpts
    ? map(Array.from({ length: opts.channels }), (_) =>
        filter(opts.sampleRate, filterOpts)
      )
    : [];

const toPlayerState = (
  cur: PlayerState,
  next: UIState,
  opts: Options,
  t: number
): PlayerState => {
  const f = next.filter;
  const notes = { ...cur.notes };
  map(next.notes, (note) => {
    if (!notes[note] || notes[note]?.released) {
      notes[note] = {
        filter: [],
        envelopes: {
          amplitude: undefined,
          cutoff: undefined,
          pitch: undefined,
        },
        FMOsc: undefined,
        LFOs: {
          amplitude: undefined,
          balance: undefined,
          cutoff: undefined,
          pitch: undefined,
        },
        oscillators: [],
        released: false,
      };
    }
  });
  mapO(notes, (state, note) => {
    const released = state.released || !next.notes.includes(note);

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

    const envelopes = fromEntries(
      next.envelopes.map<[EnvelopeTarget, EnvelopeInstance]>((env) => [
        env.target,
        envelope(env, state.envelopes[env.target]?.getState()),
      ])
    );

    const oscillators =
      curOscillators.length === nextOscs.length
        ? map(nextOscs, (osc, index) =>
            oscillator(osc.getOsc(), curOscillators[index].getPhase())
          )
        : nextOscs;

    const FMOsc = next.FMOsc
      ? FMOscillator(next.FMOsc, state.FMOsc?.osc.getPhase())
      : undefined;

    const LFOs = fromEntries(
      next.LFOs.map<[LFOTarget, LFOInstance]>((LFO) => {
        const phase = LFO.sync ? undefined : t / (1 / LFO.freq);
        const osc =
          state.LFOs[LFO.target]?.osc || oscillator(defaultOsc(LFO.osc), phase);

        return [LFO.target, { osc, amount: LFO.amount, freq: LFO.freq }];
      })
    );

    notes[note] = {
      ...state,
      filter: nextFilter,
      LFOs,
      envelopes,
      FMOsc,
      oscillators,
      released,
    };
  });

  const nextDelay = next.delay
    ? delay(next.delay, opts, cur.delay?.getState())
    : undefined;

  const EQLow = getEQ(
    opts.sampleRate,
    "low-shelf",
    next.master.EQLow,
    cur.master.EQLow?.getState()
  );
  const EQHigh = getEQ(
    opts.sampleRate,
    "high-shelf",
    next.master.EQHigh,
    cur.master.EQHigh?.getState()
  );

  const nextCompressor = next.compressor
    ? compressor(next.compressor, opts, cur.compressor?.getSamples())
    : undefined;

  return {
    compressor: nextCompressor,
    delay: nextDelay,
    distortion: next.distortion,
    master: {
      ...next.master,
      EQHigh,
      EQLow,
    },
    notes,
  };
};

export const Player = (opts: Options) => {
  let state: PlayerState = {
    compressor: undefined,
    delay: undefined,
    distortion: undefined,
    master: {
      dcOffset: 0,
      EQHigh: undefined,
      EQLow: undefined,
      gain: 1,
      transpose: 0,
    },
    notes: {},
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
      let left = 0;

      for (let i = 0; i < numSamples; i++) {
        for (let channel = 0; channel < opts.channels; channel++) {
          const t = (samplesGenerated + i) / opts.sampleRate;
          const compGain = state.compressor?.getGain() ?? 1;
          const sample =
            compGain *
            state.master.gain *
            generateSample(channel, state, opts, onSilent);
          if (channel === 0) {
            left = sample;
            samples.push(sample / 2);
          } else {
            state.compressor?.tick(left / 2 + sample / 2);
            samples[i] = samples[i] + sample / 2;
          }
          const val = amplitude * clamp(sample, -1, 1);
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
    setState: (next: UIState) => {
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
