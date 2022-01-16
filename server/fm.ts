import { FMOsc } from "../interface/state";
import { noise, sine } from "./osc";
import { forEach } from "./util";

export type FMOscillatorInstance = ReturnType<typeof FMOscillator>;

export type FMModulation = Record<
  number,
  {
    amplitude: number;
    detune: number;
  }
>;

export const FMOscillator = (
  osc: FMOsc & { index: number },
  initialPhase = 0
) => {
  let phase = initialPhase;

  const generator = osc.type === "sine" ? sine : noise;

  const oscFn = (dt: number, freq: number, mod: FMModulation): number => {
    const modGain = mod[osc.index].amplitude ?? 1;
    const modDetune = mod[osc.index].detune ?? 0;
    const freq2 = freq * (osc.ratio + modDetune);

    const phaseDelta = (dt * freq2) % 1;
    phase += phaseDelta;

    return osc.gain * modGain * generator(phase);
  };

  oscFn.getPhase = () => phase;
  oscFn.config = osc;

  return oscFn;
};
