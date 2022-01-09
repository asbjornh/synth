import fs from "fs";
import path from "path";

import { filter, FilterInstance, getEQ } from "./filter";
import { forEachO, map } from "./util";
import {
  Distortion,
  EnvelopeTarget,
  Filter,
  LFOTarget,
  Note,
  NoteDescriptor,
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

export const mutatePlayerState = (
  state: PlayerState,
  next: UIState,
  opts: Options,
  t: number
) => {
  const recorder = next.master.recording
    ? state.recorder ??
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "../recordings",
          new Date().toUTCString() + ".wav"
        )
      )
    : undefined;

  if (state.recorder && !next.master.recording) {
    state.recorder.close();
  } else if (!state.recorder && recorder) {
    recorder.write(getFileHeaders({ ...opts, dataLength: 0 }));
  }

  const newState: PlayerState = {
    delay: next.delay
      ? delay(next.delay, opts, state.delay?.getState())
      : undefined,
    master: {
      dcOffset: next.master.dcOffset,
      gain: next.master.gain,
      transpose: next.master.transpose,
      EQLow: getEQ(
        opts.sampleRate,
        "low-shelf",
        next.master.EQLow,
        state.master.EQLow?.getState()
      ),
      EQHigh: getEQ(
        opts.sampleRate,
        "high-shelf",
        next.master.EQHigh,
        state.master.EQHigh?.getState()
      ),
    },
    notes: state.notes,
    distortion: next.distortion,
    compressor: next.compressor
      ? compressor(next.compressor, opts, state.compressor?.getSamples())
      : undefined,
    recorder,
    velocity: next.velocity,
  };

  const f = next.filter;
  forEachO(newState.notes, (cur) => {
    cur.filter = f
      ? map(cur.filter, (instance) =>
          filter(opts.sampleRate, f, instance.getState())
        )
      : [];

    const nextOscs = next.oscillators.flatMap((osc) =>
      osc.options.unison === 1 ? [oscillator(osc)] : unison(osc)
    );
    cur.oscillators =
      cur.oscillators.length === nextOscs.length
        ? map(nextOscs, (osc, index) =>
            oscillator(osc.getOsc(), cur.oscillators[index].getPhase())
          )
        : nextOscs;

    cur.envelopes = fromEntries(
      next.envelopes.map<[EnvelopeTarget, EnvelopeInstance]>((env) => [
        env.target,
        envelope(env, cur.envelopes[env.target]?.getState()),
      ])
    );

    cur.FMOsc = next.FMOsc
      ? FMOscillator(next.FMOsc, cur.FMOsc?.osc.getPhase())
      : undefined;

    cur.LFOs = fromEntries(
      next.LFOs.map<[LFOTarget, LFOInstance]>((LFO) => {
        const phase = LFO.sync ? undefined : t / (1 / LFO.freq);
        const osc =
          cur.LFOs[LFO.target]?.osc || oscillator(defaultOsc(LFO.osc), phase);

        return [LFO.target, { osc, amount: LFO.amount, freq: LFO.freq }];
      })
    );
  });

  return newState;
};

/** Initialize new notes once they start playing, set `released` flag once notes stop being played */
export const mutateNotes = (
  notes: NoteDescriptor[],
  state: UIState,
  player: PlayerState,
  opts: Options,
  t: number
) => {
  const playing: Partial<Record<Note, boolean>> = {};

  for (let i = 0, l = notes.length; i < l; i++) {
    const { note, velocity } = notes[i];

    playing[note] = true;

    if (!player.notes[note] || player.notes[note]?.released) {
      const envelopes = fromEntries(
        state.envelopes.map<[EnvelopeTarget, EnvelopeInstance]>((env) => [
          env.target,
          envelope(env),
        ])
      );

      const LFOs = fromEntries(
        state.LFOs.map<[LFOTarget, LFOInstance]>((LFO) => {
          const phase = LFO.sync ? undefined : t / (1 / LFO.freq);
          const osc = oscillator(defaultOsc(LFO.osc), phase);

          return [LFO.target, { osc, amount: LFO.amount, freq: LFO.freq }];
        })
      );

      const oscillators = state.oscillators.flatMap((osc) =>
        osc.options.unison === 1 ? [oscillator(osc)] : unison(osc)
      );

      player.notes[note] = {
        envelopes,
        FMOsc: state.FMOsc ? FMOscillator(state.FMOsc) : undefined,
        LFOs,
        oscillators,
        filter: filterInit(opts, state.filter),
        released: false,
        velocity,
      };
    }
  }

  forEachO(player.notes, (state, key) => {
    if (!playing[key]) {
      state.released = true;
    }
  });
};
