import { Note } from "../interface/state";
import { frequencies } from "./frequencies";
import { transpose } from "./osc";
import { NoteState, PlayerState } from "./player-state";
import { clamp } from "./util";

export const evalModulation = (
  state: PlayerState,
  note: Note,
  noteState: NoteState,
  dt: number
) => {
  const { FMOsc, LFOs, envelopes, released, velocity } = noteState;

  const veloAmp = clamp(
    velocity * state.velocity.scale + state.velocity.offset,
    0,
    1
  );

  const pLFO = LFOs.pitch;
  const LFODetune = pLFO ? pLFO.osc(dt, pLFO.freq) * 1200 * pLFO.amount : 0;

  const aLFO = LFOs.amplitude;
  const LFOamp = aLFO ? 1 + aLFO.osc(dt, aLFO.freq) * aLFO.amount : 1;

  const pitch = envelopes.pitch?.(dt, released).value ?? 1;
  const envDetune = (1 - pitch) * 1200 * (envelopes.pitch?.config.amount ?? 0);

  const { value: envAmp, done } = envelopes.amplitude
    ? envelopes.amplitude(dt, released)
    : { value: 1, done: released };

  const FMPitch = envelopes.FMPitch?.(dt, released).value ?? 0;
  const FMEnvDetune = (1 - FMPitch) * (envelopes.FMPitch?.config.amount ?? 0);
  const FMEnvAmp = envelopes.FMAmplitude?.(dt, released).value ?? 1;

  const detune = transpose(state.master.transpose, LFODetune + envDetune);
  const freq = frequencies[note] * detune;

  const FMdetune = FMOsc
    ? 1 +
      FMOsc.gain * FMEnvAmp * FMOsc.osc(dt, freq * (FMOsc.ratio + FMEnvDetune))
    : 1;

  const bLFO = LFOs.balance;
  const LFObalance = bLFO ? bLFO.osc(dt, bLFO.freq) * bLFO.amount : 0;

  return {
    amplitude: envAmp * veloAmp * LFOamp,
    balance: LFObalance,
    detune,
    done,
    FMdetune,
  };
};
