export const distortion = (sample: number) =>
  sample > 0 ? 1 - Math.exp(-sample) : -1 + Math.exp(sample);
