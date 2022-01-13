import { FMOsc } from "../interface/state";
import { defaultOsc, oscillator } from "./osc";
import { forEach } from "./util";

export type FMOscillatorInstance = ReturnType<typeof FMOscillator>;

export const FMOscillator = (fmOsc: FMOsc, initialPhase?: number) => {
  const { type, ...rest } = fmOsc;
  return {
    osc: oscillator(defaultOsc(fmOsc.type), -1, initialPhase),
    ...rest,
  };
};

type Modulation = Record<
  number,
  {
    amplitude: number;
    detune: number;
  }
>;

export const evalFM = (
  oscs: FMOscillatorInstance[],
  mod: Modulation,
  freq: number,
  dt: number
) => {
  const out: Record<"all" | number, number> = {
    all: 1,
    0: 1,
    1: 1,
    2: 1,
  };

  forEach(oscs, (osc, index) => {
    const amp = mod[index]?.amplitude ?? 1;
    const detune = mod[index]?.detune ?? 0;
    out[osc.target] +=
      osc.gain * amp * osc.osc(dt, freq * (osc.ratio + detune));
  });

  return out;
};
