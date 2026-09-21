import { hasItem, setItem } from "./storage.ts";

export type Dataset = Record<string, unknown>;

export function isDataset(value: unknown): value is Dataset {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

  seedDataset(dataset, { overwrite: false });
}