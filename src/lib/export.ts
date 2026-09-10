function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function escapeCSVField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return escapeCSVField(JSON.stringify(value));
  }

  return escapeCSVField(String(value));
}

export function exportToJSON<T>(data: T, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  downloadBlob(blob, `${filename}.json`);
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
): void {
  if (data.length === 0) {
    return;
  }

  const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));
  const headerRow = headers.map(escapeCSVField).join(",");

  const rows = data.map((row) =>
    headers.map((key) => formatCSVValue(row[key])).join(","),
  );

  const csv = [headerRow, ...rows].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });

  downloadBlob(blob, `${filename}.csv`);
}
