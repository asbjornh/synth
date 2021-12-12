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
