/** Items whose `key` property equals `value`. `value` must have the type of that property. */
export function filterBy<T, K extends keyof T>(items: readonly T[], key: K, value: T[K]): T[] {
  return items.filter((item) => item[key] === value);
}

/** The item with the given id, or undefined. Works for any item that has a string `id`. */
export function findById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}

/** Groups items by the key that `getKey` returns. */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K,
): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};

  for (const item of items) {
    const key = getKey(item);
    const group = groups[key];
    if (group) {
      group.push(item);
    } else {
      groups[key] = [item];
    }
  }

  return groups;
}