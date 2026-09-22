// features/needfinding/NeedfindingPage.tsx
//
// Entry point that hooks into the router (blueprint.md §4). It doesn't wrap
// the content in <AppShell>/<NavMenu> again: that lives once in
// router.tsx/App.tsx as the shared layout for the 6 interfaces; this page is
// what gets rendered inside that layout.
//
// UNVERIFIED ASSUMPTIONS about lib/ (adjust to the real signature):
// - lib/storage.ts exposes `createStorageKey(name)`, `getItem<T>(key)` and
//   `setItem<T>(key, value)`.
// - lib/list.ts exposes `addItem`, `updateItem`, `removeItem` — immutable
//   helpers that generate/locate the id internally.
// - lib/export.ts exposes `exportToJSON(filename, data)` and
//   `exportToCSV(filename, data)`.
// - ExportButton accepts `label` + `onExport`.

import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ExportButton } from "../../components/ui/ExportButton";
import { cn } from "../../lib/cn";
import { createStorageKey, getItem, setItem } from "../../lib/storage";
import { addToList, updateInList, removeFromList } from "../../lib/list";
import { ObservationForm } from "./components/ObservationForm";
import { ObservationCard } from "./components/ObservationCard";
import type { NeedfindingFormValues, NeedfindingObservation } from "./types";
import { useState, useMemo } from "react";

const STORAGE_KEY = createStorageKey("needfinding", "observations");

export function NeedfindingPage() {
  const [observations, setObservations] = useState<NeedfindingObservation[]>(
  () => getItem<NeedfindingObservation[]>(STORAGE_KEY, []) ?? [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  function persist(next: NeedfindingObservation[]) {
    setObservations(next);
    setItem(STORAGE_KEY, next);
  }

  function handleSubmit(values: NeedfindingFormValues) {
    if (editingId) {
      persist(updateInList(observations, editingId, values));
      setEditingId(null);
    } else {
      persist(addToList(observations, values));
    }
  }

  function handleDelete(id: string) {
    persist(removeFromList(observations, id));
    if (editingId === id) setEditingId(null);
  }

  const editingObservation = useMemo(
    () => observations.find((o) => o.id === editingId) ?? null,
    [observations, editingId],
  );

  const highPotentialCount = observations.filter(
    (o) => o.innovationPotential === "alto",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-1">
        <h1 className="text-heading-2">Needfinding — El Iceberg</h1>
        <p className="text-body-sm text-neutral-500">
          Separa, por cada observación, la necesidad obvia en la superficie
          de la necesidad oculta en profundidad, distinguiendo el dato crudo
          de la interpretación.
        </p>
      </Card>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{observations.length} observaciones</Badge>
          <Badge variant={highPotentialCount > 0 ? "success" : "neutral"}>
            {highPotentialCount} con potencial alto
          </Badge>
        </div>
      <div className="flex flex-wrap gap-2">
      <ExportButton 
        data={observations} 
        filename="needfinding" 
      />
      </div>
      </Card>

      <ObservationForm
        initialValues={editingObservation}
        onSubmit={handleSubmit}
        onCancelEdit={() => setEditingId(null)}
      />

      <section aria-label="Observaciones registradas" className="flex flex-col gap-4">
        <h2 className="text-heading-3">Registros</h2>

        {observations.length === 0 ? (
          <Card className="text-body-sm text-neutral-500">
            Todavía no hay observaciones registradas.
          </Card>
        ) : (
          <div className={cn("grid grid-cols-1 gap-4", "md:grid-cols-2", "lg:grid-cols-3")}>
            {observations.map((observation) => (
              <ObservationCard
                key={observation.id}
                observation={observation}
                onEdit={(o) => setEditingId(o.id)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default NeedfindingPage;
