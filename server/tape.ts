const wrap = (length: number, offset: number) =>
  offset < 0 ? length + offset : offset % length;

export type Tape = ReturnType<typeof tape>;

export type TapeState = { pos: number; samples: number[] };

export const tape = (
  length: number,
  state: TapeState = { pos: 0, samples: [] }
) => {
  const samples =
    state.samples && state.samples.length === length
      ? state.samples
      : Array.from<number>({ length }).fill(0);

  let pos = state.pos;

  /** Move the tape one tick forward */
  const tick = () => {
    pos = wrap(length, pos + 1);
  };

  const read = (offset: number) => samples[wrap(length, pos + offset)];

  const write = (offset: number, sample: number) => {
    samples[wrap(length, pos + offset)] = sample;
  };

  const getState = () => ({ pos, samples });

  return { tick, read, write, getState };
};
