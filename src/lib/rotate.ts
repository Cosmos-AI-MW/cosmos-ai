// Shifts a list by one position per day (Malawi time, UTC+2).
// pinFirst keeps that many items fixed at the front.
export function rotateDaily<T>(
  items: T[],
  options: { pinFirst?: number } = {},
): T[] {
  const pinFirst = options.pinFirst ?? 0;
  const pinned = items.slice(0, pinFirst);
  const rest = items.slice(pinFirst);
  if (rest.length < 2) return items;

  const malawiNow = Date.now() + 2 * 60 * 60 * 1000;
  const dayNumber = Math.floor(malawiNow / 86_400_000);
  const offset = dayNumber % rest.length;

  return [...pinned, ...rest.slice(offset), ...rest.slice(0, offset)];
}
