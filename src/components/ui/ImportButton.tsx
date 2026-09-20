import { useId, useRef, useState, type ChangeEvent } from "react";
import { cn } from "../../lib/cn.ts";
import { isDataset, seedDataset, type Dataset } from "../../lib/import.ts";
import {
  FEATURE_LABELS,
  STORAGE_KEY_PREFIX,
  type FeatureSlug,
} from "../../lib/storage.ts";
import { Button } from "./Button.tsx";
import { Modal } from "./Modal.tsx";

export interface ImportButtonProps {
  className?: string;
}

interface Feedback {
  kind: "error" | "success";
  text: string;
}

function describeAffectedInterfaces(dataset: Dataset): string[] {
  const labels = new Set<string>();

  for (const key of Object.keys(dataset)) {
    const [prefix, feature] = key.split(":");
    const isOwnKey = prefix === STORAGE_KEY_PREFIX && Boolean(feature);

    labels.add(
      isOwnKey ? (FEATURE_LABELS[feature as FeatureSlug] ?? feature) : key,
    );
  }

  return Array.from(labels).sort((a, b) => a.localeCompare(b, "es"));
}

export function ImportButton({ className }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackId = useId();

  const [pendingDataset, setPendingDataset] = useState<Dataset | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const affectedInterfaces = pendingDataset
    ? describeAffectedInterfaces(pendingDataset)
    : [];

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setFeedback(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setFeedback({
        kind: "error",
        text: `El archivo "${file.name}" no es un JSON válido.`,
      });
      return;
    }

    if (!isDataset(parsed)) {
      setFeedback({
        kind: "error",
        text: `El archivo "${file.name}" debe contener un objeto JSON.`,
      });
      return;
    }

    setPendingDataset(parsed);
  }

  function handleConfirm() {
    if (!pendingDataset) return;

    seedDataset(pendingDataset, { overwrite: true });
    setPendingDataset(null);
    setFeedback({ kind: "success", text: "Dataset importado correctamente." });
  }

  function handleCancel() {
    setPendingDataset(null);
  }

  return (
    <div className={cn("w-full flex flex-col items-start gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />

      <Button
        className="w-auto"
        aria-describedby={feedback ? feedbackId : undefined}
        onClick={() => inputRef.current?.click()}
      >
        Importar dataset
      </Button>

      {feedback && (
        <p
          id={feedbackId}
          role={feedback.kind === "error" ? "alert" : "status"}
          className={cn(
            "text-body-sm",
            feedback.kind === "error" ? "text-danger" : "text-ink-secondary",
          )}
        >
          {feedback.text}
        </p>
      )}

      <Modal
        open={pendingDataset !== null}
        onClose={handleCancel}
        title="Confirmar importación"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-ink-primary">
            Esta acción reemplazará los datos guardados de:
          </p>
          <ul className="list-disc pl-5 text-body-sm text-ink-primary">
            {affectedInterfaces.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <p className="text-body-sm text-ink-secondary">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="w-auto"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              className="w-auto"
              onClick={handleConfirm}
            >
              Reemplazar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}