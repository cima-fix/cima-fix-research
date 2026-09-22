// features/roper-dynagram/RoperDynagramPage.tsx
// "Roper Dynagram" interface entry point — investigacion_de_usuarios.md §5.
// Segmento y AsignacionSegmento viven en types/common.ts (contrato de
// blueprint.md §4.1); Sujeto es exclusivo de esta interfaz (types.ts).

import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable";
import { ExportButton } from "../../components/ui/ExportButton";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { addToList, removeFromList, updateInList } from "../../lib/list";
import { createStorageKey, getItem, setItem } from "../../lib/storage";
import type { AsignacionSegmento, Segmento } from "../../types/common";
import { AsignacionForm } from "./components/AsignacionForm";
import { DynamicPanel } from "./components/DynamicPanel";
import { SegmentoForm } from "./components/SegmentoForm";
import { SegmentWheel } from "./components/SegmentWheel";
import { computeSegmentStats } from "./stats";
import type { Sujeto } from "./types";

const SUJETOS_KEY = createStorageKey("roper-dynagram", "sujetos");
const SEGMENTOS_KEY = createStorageKey("roper-dynagram", "segmentos");
const ASIGNACIONES_KEY = createStorageKey("roper-dynagram", "asignaciones");

export function RoperDynagramPage() {
  const [sujetos, setSujetos] = useState<Sujeto[]>(() =>
    getItem<Sujeto[]>(SUJETOS_KEY, []),
  );
  const [segmentos, setSegmentos] = useState<Segmento[]>(() =>
    getItem<Segmento[]>(SEGMENTOS_KEY, []),
  );
  const [asignaciones, setAsignaciones] = useState<AsignacionSegmento[]>(() =>
    getItem<AsignacionSegmento[]>(ASIGNACIONES_KEY, []),
  );

  const [newSujetoNombre, setNewSujetoNombre] = useState("");

  const [editingSegmento, setEditingSegmento] = useState<Segmento | null>(null);
  const [segmentoFormOpen, setSegmentoFormOpen] = useState(false);
  const [segmentoDeleteTarget, setSegmentoDeleteTarget] = useState<Segmento | null>(
    null,
  );
  // Fuerza un formulario nuevo (sin arrastrar valores de la vez anterior)
  // en cada apertura del modal, incluyendo dos "crear" consecutivos —
  // ver comentario en el JSX del Modal, más abajo.
  const [segmentoFormKey, setSegmentoFormKey] = useState(0);

  const [editingAsignacion, setEditingAsignacion] =
    useState<AsignacionSegmento | null>(null);
  const [asignacionFormOpen, setAsignacionFormOpen] = useState(false);
  const [asignacionDeleteTarget, setAsignacionDeleteTarget] =
    useState<AsignacionSegmento | null>(null);
  const [asignacionFormKey, setAsignacionFormKey] = useState(0);

  const [selectedSegmentoId, setSelectedSegmentoId] = useState<string | null>(null);

  function persistSujetos(next: Sujeto[]) {
    setSujetos(next);
    setItem(SUJETOS_KEY, next);
  }

  function persistSegmentos(next: Segmento[]) {
    setSegmentos(next);
    setItem(SEGMENTOS_KEY, next);
  }

  function persistAsignaciones(next: AsignacionSegmento[]) {
    setAsignaciones(next);
    setItem(ASIGNACIONES_KEY, next);
  }

  // --- Sujetos entrevistados ---

  function handleAddSujeto() {
    if (!newSujetoNombre.trim()) return;
    persistSujetos(addToList(sujetos, { nombre: newSujetoNombre.trim() }));
    setNewSujetoNombre("");
  }

  function handleRemoveSujeto(id: string) {
    persistSujetos(removeFromList(sujetos, id));
    // Las asignaciones de un sujeto eliminado dejan de tener sentido —
    // se quitan junto con él para no dejar referencias huérfanas.
    persistAsignaciones(asignaciones.filter((a) => a.sujetoId !== id));
  }

  // --- Segmentos ---

  function handleCreateSegmento() {
    setEditingSegmento(null);
    setSegmentoFormKey((k) => k + 1);
    setSegmentoFormOpen(true);
  }

  function handleEditSegmento(item: Segmento) {
    setEditingSegmento(item);
    setSegmentoFormKey((k) => k + 1);
    setSegmentoFormOpen(true);
  }

  function handleSaveSegmento(data: Omit<Segmento, "id">) {
    persistSegmentos(
      editingSegmento
        ? updateInList(segmentos, editingSegmento.id, data)
        : addToList(segmentos, data),
    );
    setSegmentoFormOpen(false);
    setEditingSegmento(null);
  }

  function handleConfirmDeleteSegmento() {
    if (!segmentoDeleteTarget) return;
    persistSegmentos(removeFromList(segmentos, segmentoDeleteTarget.id));
    persistAsignaciones(
      asignaciones.filter((a) => a.segmentoId !== segmentoDeleteTarget.id),
    );
    if (selectedSegmentoId === segmentoDeleteTarget.id) setSelectedSegmentoId(null);
    setSegmentoDeleteTarget(null);
  }

  // --- Asignaciones ---

  function handleCreateAsignacion() {
    setEditingAsignacion(null);
    setAsignacionFormKey((k) => k + 1);
    setAsignacionFormOpen(true);
  }

  function handleEditAsignacion(item: AsignacionSegmento) {
    setEditingAsignacion(item);
    setAsignacionFormKey((k) => k + 1);
    setAsignacionFormOpen(true);
  }

  function handleSaveAsignacion(data: Omit<AsignacionSegmento, "id">) {
    persistAsignaciones(
      editingAsignacion
        ? updateInList(asignaciones, editingAsignacion.id, data)
        : addToList(asignaciones, data),
    );
    setAsignacionFormOpen(false);
    setEditingAsignacion(null);
  }

  function handleConfirmDeleteAsignacion() {
    if (!asignacionDeleteTarget) return;
    persistAsignaciones(removeFromList(asignaciones, asignacionDeleteTarget.id));
    setAsignacionDeleteTarget(null);
  }

  // --- Rueda + panel dinámico ---

  const stats = useMemo(
    () => computeSegmentStats(segmentos, asignaciones),
    [segmentos, asignaciones],
  );

  const selectedSegmento =
    segmentos.find((segmento) => segmento.id === selectedSegmentoId) ?? null;

  const sujetoNombrePorId = useMemo(
    () => new Map(sujetos.map((sujeto) => [sujeto.id, sujeto.nombre])),
    [sujetos],
  );

  const segmentoNombrePorId = useMemo(
    () => new Map(segmentos.map((segmento) => [segmento.id, segmento.nombre])),
    [segmentos],
  );

  const segmentoColumns: DataTableColumn<Segmento>[] = [
    { key: "nombre", header: "Nombre" },
    { key: "criterio", header: "Valores / criterio" },
    {
      key: "id",
      id: "porcentaje",
      header: "% observado",
      render: (item) => {
        const stat = stats.find((s) => s.segmento.id === item.id);
        return `${Math.round((stat?.porcentaje ?? 0) * 100)}%`;
      },
    },
  ];

  const asignacionColumns: DataTableColumn<AsignacionSegmento>[] = [
    {
      key: "sujetoId",
      header: "Sujeto",
      render: (item) => sujetoNombrePorId.get(item.sujetoId) ?? "Sujeto eliminado",
    },
    {
      key: "segmentoId",
      header: "Segmento",
      render: (item) =>
        segmentoNombrePorId.get(item.segmentoId) ?? "Segmento eliminado",
    },
    { key: "evidencia", header: "Evidencia" },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-4 font-medium text-ink-primary">
          Roper Dynagram
        </h1>
        <p className="text-body-sm text-ink-secondary">
          Segmentación de usuarios entrevistados por valores y estilos de vida.
        </p>
      </header>

      {/* Sujetos entrevistados */}
      <section aria-labelledby="sujetos-heading" className="flex flex-col gap-3">
        <h2 id="sujetos-heading" className="text-heading-6 font-semibold text-ink-primary">
          Sujetos entrevistados
        </h2>
        <div className="flex gap-2">
          <FormField id="nuevo-sujeto" label="Nombre" className="flex-1">
            <Input
              value={newSujetoNombre}
              onChange={(e) => setNewSujetoNombre(e.target.value)}
              placeholder="Nombre o alias del entrevistado..."
            />
          </FormField>
          <Button className="w-auto self-end" onClick={handleAddSujeto}>
            + Sujeto
          </Button>
        </div>
        {sujetos.length === 0 ? (
          <p className="text-body-sm text-ink-secondary">
            Todavía no hay sujetos registrados.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {sujetos.map((sujeto) => (
              <li key={sujeto.id}>
                <Badge className="gap-2 py-1 px-2">
                  {sujeto.nombre}
                  <button
                    type="button"
                    aria-label={`Eliminar sujeto: ${sujeto.nombre}`}
                    onClick={() => handleRemoveSujeto(sujeto.id)}
                  >
                    ×
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Segmentos */}
      <section aria-labelledby="segmentos-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="segmentos-heading"
            className="text-heading-6 font-semibold text-ink-primary"
          >
            Segmentos
          </h2>
          <Button className="w-auto" onClick={handleCreateSegmento}>
            Nuevo segmento
          </Button>
        </div>

        <ExportButton data={segmentos} filename="roper-dynagram-segmentos" />

        <Card>
          <DataTable
            columns={segmentoColumns}
            data={segmentos}
            onEdit={handleEditSegmento}
            onDelete={setSegmentoDeleteTarget}
            getRowLabel={(item) => item.nombre}
            emptyMessage="Todavía no hay segmentos definidos."
          />
        </Card>
      </section>

      {/* Asignaciones */}
      <section aria-labelledby="asignaciones-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="asignaciones-heading"
            className="text-heading-6 font-semibold text-ink-primary"
          >
            Asignación de sujetos a segmentos
          </h2>
          <Button
            className="w-auto"
            onClick={handleCreateAsignacion}
            disabled={sujetos.length === 0 || segmentos.length === 0}
          >
            Nueva asignación
          </Button>
        </div>

        <ExportButton data={asignaciones} filename="roper-dynagram-asignaciones" />

        <Card>
          <DataTable
            columns={asignacionColumns}
            data={asignaciones}
            onEdit={handleEditAsignacion}
            onDelete={setAsignacionDeleteTarget}
            getRowLabel={(item) =>
              `${sujetoNombrePorId.get(item.sujetoId) ?? "sujeto"} → ${
                segmentoNombrePorId.get(item.segmentoId) ?? "segmento"
              }`
            }
            emptyMessage="Todavía no hay asignaciones registradas."
          />
        </Card>
      </section>

      {/* Rueda + panel dinámico */}
      <section
        aria-labelledby="rueda-heading"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-3">
          <h2 id="rueda-heading" className="text-heading-6 font-semibold text-ink-primary">
            Rueda de segmentos
          </h2>
          <SegmentWheel
            stats={stats}
            selectedSegmentoId={selectedSegmentoId}
            onSelect={setSelectedSegmentoId}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-6 font-semibold text-ink-primary">
            Panel dinámico de salida
          </h2>
          <DynamicPanel segmento={selectedSegmento} />
        </div>
      </section>

      {/* Modales: formularios y confirmaciones de eliminar */}
      <Modal
        open={segmentoFormOpen}
        onClose={() => setSegmentoFormOpen(false)}
        title={editingSegmento ? "Editar segmento" : "Nuevo segmento"}
      >
        {/*
          key=segmentoFormKey (no editingSegmento?.id ?? "new"): dos
          aperturas en modo "crear" seguidas comparten el mismo "new" y
          React reutilizaba la misma instancia del formulario, dejando
          los valores de la vez anterior — el contador cambia en cada
          apertura y fuerza un remount con el formulario en blanco.
        */}
        <SegmentoForm
          key={segmentoFormKey}
          initialValue={editingSegmento}
          onSubmit={handleSaveSegmento}
          onCancel={() => setSegmentoFormOpen(false)}
        />
      </Modal>

      <Modal
        open={segmentoDeleteTarget !== null}
        onClose={() => setSegmentoDeleteTarget(null)}
        title="Eliminar segmento"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-ink-primary">
            ¿Eliminar el segmento &quot;{segmentoDeleteTarget?.nombre}&quot;? También
            se eliminan las asignaciones que lo referencian. Esta acción no se puede
            deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={() => setSegmentoDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-auto"
              onClick={handleConfirmDeleteSegmento}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={asignacionFormOpen}
        onClose={() => setAsignacionFormOpen(false)}
        title={editingAsignacion ? "Editar asignación" : "Nueva asignación"}
      >
        <AsignacionForm
          key={asignacionFormKey}
          initialValue={editingAsignacion}
          sujetos={sujetos}
          segmentos={segmentos}
          onSubmit={handleSaveAsignacion}
          onCancel={() => setAsignacionFormOpen(false)}
        />
      </Modal>

      <Modal
        open={asignacionDeleteTarget !== null}
        onClose={() => setAsignacionDeleteTarget(null)}
        title="Eliminar asignación"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-ink-primary">
            ¿Eliminar esta asignación? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={() => setAsignacionDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-auto"
              onClick={handleConfirmDeleteAsignacion}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
