export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return JSON.parse(JSON.stringify(fallback)) as T;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to read "${key}" from localStorage:`, error);
    return JSON.parse(JSON.stringify(fallback)) as T;
  }
}

export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage:`, error);
    throw error;
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove "${key}" from localStorage:`, error);
    throw error;
  }
}

export type FeatureSlug =
  | "expert-interviews"
  | "extreme-users"
  | "needfinding"
  | "empathy-map"
  | "roper-dynagram"
  | "requirements-mapping";

export const STORAGE_KEY_PREFIX = "cima-fix-research";

export function createStorageKey(feature: FeatureSlug, entity: string): string {
  return `${STORAGE_KEY_PREFIX}:${feature}:${entity}`;
}

export const FEATURE_LABELS: Record<FeatureSlug, string> = {
  "expert-interviews": "Entrevista a Expertos",
  "extreme-users": "Usuarios Extremos",
  "needfinding": "Needfinding (El Iceberg)",
  "empathy-map": "Empathy Map (The Parser)",
  "roper-dynagram": "Roper Dynagram",
  "requirements-mapping": "Mapeo de Requerimientos",
};