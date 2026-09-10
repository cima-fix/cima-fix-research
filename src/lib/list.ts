export interface Identifiable {
  id: string;
}

export function createId(): string {
  return crypto.randomUUID();
}

export function addToList<T extends Identifiable>(
  list: T[],
  item: Omit<T, "id">,
): T[] {
  return [...list, { ...item, id: createId() } as T];
}

export function updateInList<T extends Identifiable>(
  list: T[],
  id: string,
  updates: Partial<Omit<T, "id">>,
): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function removeFromList<T extends Identifiable>(
  list: T[],
  id: string,
): T[] {
  return list.filter((item) => item.id !== id);
}
