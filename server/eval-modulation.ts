import { Velocity, VelocityTarget } from "../interface/state";
import { EnvelopeInstance } from "./envelope";
import { transpose } from "./osc";
import { NoteState, PlayerState } from "./player-state";
import { clamp } from "./util";

export const evalModulation = (
  state: PlayerState,
  noteState: NoteState,
  dt: number
) => {
  const { LFOs, envelopes, released, velocity } = noteState;

  const velo = getVelocity(state.velocity, velocity);

  const pLFO = LFOs.pitch;
  const LFODetune = pLFO ? pLFO.osc(dt, pLFO.freq) * 1200 * pLFO.amount : 0;

  const aLFO = LFOs.amplitude;
  const LFOamp = aLFO ? 1 + aLFO.osc(dt, aLFO.freq) * aLFO.amount : 1;

  const pitch = envelopes.pitch?.(dt, released).value ?? 1;
  const envDetune = (1 - pitch) * 1200 * (envelopes.pitch?.config.amount ?? 0);

  const { value: envAmp, done } = envelopes.amplitude
    ? envelopes.amplitude(dt, released)
    : { value: 1, done: released };

  const detune = transpose(state.master.transpose, LFODetune + envDetune);

  const bLFO = LFOs.balance;
  const LFObalance = bLFO ? bLFO.osc(dt, bLFO.freq) * bLFO.amount : 0;

  const cutEnv = envelopes.cutoff;
  const envCutoff = cutEnv
    ? cutEnv(dt, released).value * cutEnv.config.amount
    : 0;
  const cLFO = LFOs.cutoff;
  const LFOcutoff = cLFO ? cLFO.osc(dt, cLFO.freq) * cLFO.amount * 10 : 0;

  return {
    amplitude: envAmp * velo("amplitude") * LFOamp,
    balance: LFObalance,
    cutoff: envCutoff + LFOcutoff,
    detune,
    done,
    FM: {
      0: FMmod(
        envelopes.FM_0_pitch,
        envelopes.FM_0_amp,
        velo("FM_0_amplitude"),
        released,
        dt
      ),
      1: FMmod(
        envelopes.FM_1_pitch,
        envelopes.FM_1_amp,
        velo("FM_1_amplitude"),
        released,
        dt
      ),
      2: FMmod(
        envelopes.FM_2_pitch,
        envelopes.FM_2_amp,
        velo("FM_2_amplitude"),
        released,
        dt
      ),
    },
  };
};

const FMmod = (
  pitch: EnvelopeInstance | undefined,
  amp: EnvelopeInstance | undefined,
  veloAmp: number,
  released: boolean,
  dt: number
) => {
  if (!pitch && !amp)
    return {
      amplitude: veloAmp,
      detune: 0,
    };
  const pitchValue = pitch?.(dt, released).value ?? 0;
  return {
    amplitude: (amp?.(dt, released).value ?? 1) * veloAmp,
    detune: (1 - pitchValue) * (pitch?.config.amount ?? 0),
  };
};

const getVelocity = (config: Velocity, velocity: number) => {
  const base = velocity * config.scale + config.offset;
  return (target: VelocityTarget) => {
    const amt = config.targets[target] ?? 0;
    return 1 - amt + base * amt;
  };
};
