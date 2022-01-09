import fs from "fs";
import path from "path";

import { filter, FilterInstance, getEQ } from "./filter";
import { map, mapO } from "./util";
import {
  Distortion,
  EnvelopeTarget,
  Filter,
  LFOTarget,
  Note,
  UIState,
  Velocity,
} from "../interface/state";
import {
  defaultOsc,
  FMOscillator,
  FMOscillatorInstance,
  oscillator,
  OscillatorInstance,
  unison,
} from "./osc";
import { delay, DelayInstance } from "./delay";
import { fromEntries } from "../client/util";
import { envelope, EnvelopeInstance } from "./envelope";
import { compressor, CompressorInstance } from "./compressor";
import { getFileHeaders } from "./wav-headers";
import { Options } from "./player";

type NoteState = {
  envelopes: Record<EnvelopeTarget, EnvelopeInstance | undefined>;
  FMOsc: FMOscillatorInstance | undefined;
  LFOs: Record<LFOTarget, LFOInstance | undefined>;
  oscillators: OscillatorInstance[];
  /** One filter instance per channel */
  filter: FilterInstance[];
  released: boolean;
  velocity: number;
};

export type LFOInstance = {
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
  recorder: fs.WriteStream | undefined;
  velocity: Velocity;
};

const filterInit = (opts: Options, filterOpts: Filter | undefined) =>
  filterOpts
    ? map(Array.from({ length: opts.channels }), (_) =>
        filter(opts.sampleRate, filterOpts)
      )
    : [];

export const toPlayerState = (
  cur: PlayerState,
  next: UIState,
  opts: Options,
  t: number
): PlayerState => {
  const f = next.filter;
  const notes = { ...cur.notes };
  map(next.notes, (note) => {
    if (!notes[note.note] || notes[note.note]?.released) {
      notes[note.note] = {
        filter: [],
        envelopes: {
          amplitude: undefined,
          cutoff: undefined,
          FMAmplitude: undefined,
          FMPitch: undefined,
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
        velocity: note.velocity,
      };
    }
  });
  const nextNotes = map(next.notes, ({ note }) => note);
  mapO(notes, (state, note) => {
    const released = state.released || !nextNotes.includes(note);

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

  const recorder = next.master.recording
    ? cur.recorder ??
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "../recordings",
          new Date().toUTCString() + ".wav"
        )
      )
    : undefined;

  if (cur.recorder && !next.master.recording) {
    cur.recorder.close();
  } else if (!cur.recorder && recorder) {
    recorder.write(getFileHeaders({ ...opts, dataLength: 0 }));
  }

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
    recorder,
    velocity: next.velocity,
  };
};
