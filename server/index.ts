import { Readable } from "stream";
import Speaker from "speaker";

import * as osc from "./osc";
import { filter } from "./filter";
import { clamp, map } from "./util";

// the frequency to play
const freq = parseFloat(process.argv[2]) || 440.0; // Concert A, default tone

// seconds worth of audio data to generate before emitting "end"
const duration = parseFloat(process.argv[3]) || 1.0;

console.log("%dhz, %d seconds", freq, duration);

type Options = {
  bitDepth: 8 | 16 | 32;
  channels: number;
  sampleRate: number;
};

const opts: Options = {
  bitDepth: 16,
  channels: 2,
  sampleRate: 44100,
};

const word = osc.fromWord("boxershorts");

const filters = map(Array.from({ length: opts.channels }), (_) =>
  filter("high-shelf", 2000, 6, 10, opts.sampleRate)
);

const gen = (numSamples: number, samplesGenerated: number) => {
  const out: number[][] = map(
    Array.from({ length: opts.channels }),
    (_) => new Array(numSamples)
  );

  for (let i = 0; i < numSamples; i++) {
    for (let channel = 0; channel < opts.channels; channel++) {
      const t = (samplesGenerated + i) / opts.sampleRate;
      // const signal = osc.nesTriangle(t, freq);
      const signal = osc.saw(t, freq);
      // const signal = osc.saw(t, freq);
      // const signal = word(t, freq);
      // const signal = osc.pulse(0.1)(t, freq);
      out[channel][i] = filters[channel](signal);
    }
  }

  return out;
};

// NOTE: /2 because the range is centered around 0
// NOTE: -1 to fix off-by-one issue
const amplitude = Math.pow(2, opts.bitDepth) / 2 - 1;

let samplesGenerated = 0;
let peakNotified = false;

new Readable({
  read: function (chunkSize) {
    const sampleSize = opts.bitDepth / 8;
    const blockAlign = sampleSize * opts.channels;
    const numSamples = (chunkSize / blockAlign) | 0;
    const buf = Buffer.alloc(numSamples * blockAlign);

    const out = gen(numSamples, samplesGenerated);

    for (let i = 0; i < numSamples; i++) {
      if ((out[0][i] < -1 || out[0][i] > 1) && !peakNotified) {
        console.log("peak");
        peakNotified = true;
      }
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
    if (samplesGenerated >= opts.sampleRate * duration) {
      // after generating "duration" second of audio, emit "end"
      this.push(null);
    }
  },
}).pipe(new Speaker(opts));
