import {
  FEATURE_LABELS,
  STORAGE_KEY_PREFIX,
  hasItem,
  setItem,
} from "./storage.ts";

export type Dataset = Record<string, unknown>;

export function isDataset(value: unknown): value is Dataset {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// A key is "ours" when it looks like `cima-fix-research:<known feature>:<entity>`,
// the same shape createStorageKey() produces.
export function isKnownStorageKey(key: string): boolean {
  const [prefix, feature, entity] = key.split(":");
  return (
    prefix === STORAGE_KEY_PREFIX &&
    feature in FEATURE_LABELS &&
    Boolean(entity)
  );
}

export interface SplitDataset {
  valid: Dataset; // entries safe to save
  ignored: string[]; // keys we skipped (unknown key or value isn't a list)
}

// Every interface stores a list, so a valid entry = known key + array value.
export function splitDataset(dataset: Dataset): SplitDataset {
  const valid: Dataset = {};
  const ignored: string[] = [];

  for (const [key, value] of Object.entries(dataset)) {
    if (isKnownStorageKey(key) && Array.isArray(value)) {
      valid[key] = value;
    } else {
      ignored.push(key);
    }
  }

  return { valid, ignored };
}

async function fetchDataset(url: string): Promise<Dataset | null> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.warn(`Failed to fetch dataset from "${url}":`, error);
    return null;
  }

  if (!response.ok) {
    if (response.status !== 404) {
      console.warn(
        `Dataset fetch from "${url}" failed with status ${response.status}.`,
      );
    }
    return null;
  }

  try {
    const parsed: unknown = await response.json();
    if (!isDataset(parsed)) {
      console.warn(`Dataset at "${url}" is not a JSON object, ignoring it.`);
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn(`Failed to parse dataset from "${url}" as JSON:`, error);
    return null;
  }
}

export function seedDataset(
  dataset: Dataset,
  { overwrite }: { overwrite: boolean },
): void {
  for (const [key, value] of Object.entries(dataset)) {
    try {
      if (hasItem(key) && !overwrite) {
        continue;
      }

      setItem(key, value);
    } catch (error) {
      console.error(`Failed to seed "${key}":`, error);
    }
  }
}

export async function importDatasetOnStartup(
  url: string = `${import.meta.env.BASE_URL}dataset.json`,
): Promise<void> {
  const dataset = await fetchDataset(url);
  if (dataset === null) {
    return;
  }

  const { valid, ignored } = splitDataset(dataset);
  if (ignored.length > 0) {
    console.warn(`Ignored unknown dataset keys from "${url}":`, ignored);
  }

  seedDataset(valid, { overwrite: false });
}