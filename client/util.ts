export const mapRange = (
  num: number,
  inRange: [min: number, max: number],
  outRange: [min: number, max: number]
) => {
  const [oldMin, oldMax] = inRange;
  const [newMin, newMax] = outRange;
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  return oldRange === 0
    ? newMin
    : ((num - oldMin) * newRange) / oldRange + newMin;
};

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const entries = <T extends Record<string, any>>(obj: T) =>
  Object.entries<T>(obj) as [keyof T, T[keyof T]][];

export const fromEntries = <T extends [string, any][]>(entries: T) =>
  Object.fromEntries<T>(entries) as Record<T[number][0], T[number][1]>;

export const mapValues = <T extends Record<string, any>, U>(
  obj: T,
  fn: (val: T[keyof T]) => U
): Record<string, U> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );
