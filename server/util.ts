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

export const map = <T, U>(arr: T[], fn: (el: T, index: number) => U): U[] => {
  if (arr.length === 0) return [];
  const next: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    next.push(fn(arr[i], i));
  }
  return next;
};

export const forEach = <T>(arr: T[], fn: (el: T, index: number) => void) => {
  if (arr.length === 0) return;
  for (let i = 0, l = arr.length; i < l; i++) {
    fn(arr[i], i);
  }
};

export const mapO = <O extends Record<string, any>, U>(
  obj: O,
  fn: (value: NonNullable<O[keyof O]>, key: keyof O) => U
): Record<keyof O, U> => {
  const next = {} as Record<keyof O, U>;
  for (let key in obj) {
    next[key] = fn(obj[key], key);
  }
  return next;
};

export const forEachO = <O extends Record<string, any>>(
  obj: O,
  fn: (value: NonNullable<O[keyof O]>, key: keyof O) => void
) => {
  for (let key in obj) {
    fn(obj[key], key);
  }
};

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const isOdd = (num: number) => num % 2 !== 0;

export const ratio = (value: number) =>
  value >= 0 ? 1 + value : 1 / Math.abs(value);

export const fromEntries = <T extends [string | number, any]>(
  entries: T[]
): Record<T[0], T[1]> => {
  const next = {} as Record<T[0], T[1]>;
  const l = entries.length;
  if (l === 0) return next;
  for (let i = 0; i < l; i++) {
    const key = entries[i][0] as T[0];
    next[key] = entries[i][1];
  }
  return next;
};
