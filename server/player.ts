import { Readable } from "stream";
import { AudioIO } from "naudiodon";

import { clamp } from "./util";
import {
  initialState,
  Note,
  NoteDescriptor,
  UIState,
} from "../interface/state";
import { generateSample } from "./generate-sample";
import { PlayerState, mutatePlayerState, mutateNotes } from "./player-state";

export type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

export const Player = (opts: Options) => {
  let uiState: UIState = initialState;
  let notes: NoteDescriptor[] = [];
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
    recorder: undefined,
    velocity: {
      scale: 1,
      offset: 0,
      virtual: 1,
      targets: {},
    },
  };

  let onFrame: (
    samples: number[],
    state: UIState,
    notes: NoteDescriptor[],
    t: number
  ) => void = () => {};

  const onSilent = (note: Note) => {
    delete state.notes[note];
  };

  // NOTE: /2 because the range is centered around 0
  // NOTE: -1 to fix off-by-one issue
  const amplitude = Math.pow(2, opts.bitDepth) / 2 - 1;

  let samplesGenerated = 0;

  const stream = new Readable({
    highWaterMark: 1024 * 8,
    read: function (chunkSize) {
      const sampleSize = opts.bitDepth / 8;
      const blockAlign = sampleSize * opts.channels;
      const numSamples = (chunkSize / blockAlign) | 0;
      const buf = Buffer.alloc(numSamples * blockAlign);
      const samples = new Array();

      for (let i = 0; i < numSamples; i++) {
        const sample = generateSample(state, opts, onSilent);
        const offsetL = i * sampleSize * opts.channels;
        const offsetR = i * sampleSize * opts.channels + sampleSize;
        const valL = amplitude * clamp(sample[0], -1, 1);
        const valR = amplitude * clamp(sample[1], -1, 1);
        if (opts.bitDepth === 8) {
          buf.writeInt8(valL, offsetL);
          buf.writeInt8(valR, offsetR);
        }
        if (opts.bitDepth === 16) {
          buf.writeInt16LE(valL, offsetL);
          buf.writeInt16LE(valR, offsetR);
        }
        if (opts.bitDepth === 32) {
          buf.writeInt32LE(valL, offsetL);
          buf.writeInt32LE(valR, offsetR);
        }
        samples.push((sample[0] + sample[1]) / 2);
      }

      onFrame(samples, uiState, notes, samplesGenerated / opts.sampleRate);
      this.push(buf);

      if (state.recorder) {
        state.recorder.write(buf);
      }

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
      uiState = next;
      const t = samplesGenerated / opts.sampleRate;
      state = mutatePlayerState(state, next, opts, t);
    },
    onFrame: (fn: typeof onFrame) => {
      onFrame = fn;
    },
    onPlay: (next: NoteDescriptor[]) => {
      notes = next;
      const t = samplesGenerated / opts.sampleRate;
      mutateNotes(next, uiState, state, opts, t);
    },
    kill: () => {
      stream.destroy();
      io.quit();
    },
  };
};
