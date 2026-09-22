// features/requirements-mapping/RequirementsMappingPage.tsx
// "Mapeo de Requerimientos" interface entry point —
// investigacion_de_usuarios.md §6. Insight and Segmento (+
// AsignacionSegmento, needed to derive segment size for the "ley
// embebida") are owned by interfaces 4 and 5 and are only ever read
// here, never written (blueprint.md §4.1).
//
// Layout follows the Figma wireframe: title + actions row (Trazabilidad
// toggle, exportar JSON/CSV, + Nuevo vínculo as the primary action),
// a recalculation notice banner, then the list of vínculos — which
// becomes the traceability view when the toggle is switched.

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ExportButton } from "../../components/ui/ExportButton";
import { Modal } from "../../components/ui/Modal";
import { addToList, removeFromList, updateInList } from "../../lib/list";
import { createStorageKey, getItem, setItem } from "../../lib/storage";
import type { AsignacionSegmento, Insight, Segmento } from "../../types/common";
import { RecalculationBanner, type RecalculoCambio } from "./components/RecalculationBanner";
import { RequisitoForm } from "./components/RequisitoForm";
import { TraceabilityView } from "./components/TraceabilityView";
import { VinculoCard } from "./components/VinculoCard";
import { computePrioridadConCausa } from "./priority";
import type { Prioridad, Requisito } from "./types";

const REQUISITOS_KEY = createStorageKey("requirements-mapping", "requisitos");
// Snapshot of the last priority the person actually saw for each
// requisito — the only thing that lets the recalculation banner detect
// "this changed since last time", since the priority itself is derived,
// never stored (./priority.ts).
const PRIORIDAD_VISTA_KEY = createStorageKey("requirements-mapping", "prioridad-vista");

// Read-only: owned by interface 4 (Empathy Map).
const INSIGHTS_KEY = createStorageKey("empathy-map", "insights");
// Read-only: owned by interface 5 (Roper Dynagram).
const SEGMENTOS_KEY = createStorageKey("roper-dynagram", "segmentos");
const ASIGNACIONES_KEY = createStorageKey("roper-dynagram", "asignaciones");

type Vista = "lista" | "trazabilidad";

export function RequirementsMappingPage() {
  const [requisitos, setRequisitos] = useState<Requisito[]>(() =>
    getItem<Requisito[]>(REQUISITOS_KEY, []),
  );

  // Read-only snapshots of interfaces 4 and 5, taken when entering this
  // page — so navigating here after editing Roper Dynagram or Empathy
  // Map always brings fresh data.
  const [insights] = useState<Insight[]>(() => getItem<Insight[]>(INSIGHTS_KEY, []));
  const [segmentos] = useState<Segmento[]>(() => getItem<Segmento[]>(SEGMENTOS_KEY, []));
  const [asignaciones] = useState<AsignacionSegmento[]>(() =>
    getItem<AsignacionSegmento[]>(ASIGNACIONES_KEY, []),
  );

  const [vista, setVista] = useState<Vista>("lista");

  const [editingRequisito, setEditingRequisito] = useState<Requisito | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Requisito | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [cambiosRecalculo, setCambiosRecalculo] = useState<RecalculoCambio[]>([]);

  function persistRequisitos(next: Requisito[]) {
    setRequisitos(next);
    setItem(REQUISITOS_KEY, next);
  }

  const insightsPorId = useMemo(
    () => new Map(insights.map((insight) => [insight.id, insight])),
    [insights],
  );

  const segmentosPorId = useMemo(
    () => new Map(segmentos.map((segmento) => [segmento.id, segmento])),
    [segmentos],
  );

  // "Ley embebida": recalculated on every render from real insights,
  // segments and assignments — never stored (./priority.ts).
  const prioridadConCausaPorId = useMemo(() => {
    const map = new Map<string, { prioridad: Prioridad; causa: string; detalle: string }>();
    for (const requisito of requisitos) {
      map.set(
        requisito.id,
        computePrioridadConCausa(requisito, asignaciones, segmentosPorId, insightsPorId),
      );
    }
    return map;
  }, [requisitos, asignaciones, segmentosPorId, insightsPorId]);

  const prioridadAjustadaPorId = useMemo(() => {
    const map = new Map<string, Prioridad>();
    for (const [id, valor] of prioridadConCausaPorId) map.set(id, valor.prioridad);
    return map;
  }, [prioridadConCausaPorId]);

  // On mount (= every time this page is entered), compares the current
  // adjusted priority against the last one the person saw. New
  // requisitos are "seeded" silently (no notice the first time); ones
  // that already had a seen priority and changed trigger the
  // recalculation notice.
  useEffect(() => {
    const vistaPrevia = getItem<Record<string, Prioridad>>(PRIORIDAD_VISTA_KEY, {});
    const cambios: RecalculoCambio[] = [];
    const siembraSilenciosa: Record<string, Prioridad> = {};

    for (const requisito of requisitos) {
      const actual = prioridadConCausaPorId.get(requisito.id);
      if (!actual) continue;

      const anterior = vistaPrevia[requisito.id];
      if (anterior === undefined) {
        siembraSilenciosa[requisito.id] = actual.prioridad;
        continue;
      }

      if (anterior !== actual.prioridad) {
        cambios.push({
          requisitoId: requisito.id,
          descripcion: requisito.descripcion,
          anterior,
          actual: actual.prioridad,
          detalle: actual.detalle,
        });
      }
    }

    if (Object.keys(siembraSilenciosa).length > 0) {
      setItem(PRIORIDAD_VISTA_KEY, { ...vistaPrevia, ...siembraSilenciosa });
    }
    if (cambios.length > 0) {
      // This effect syncs with an external system (the localStorage
      // snapshot of the last-seen priorities), not with React state or
      // props, so there's nothing to derive this from during render —
      // setting it here is the sync itself, not a cascading update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCambiosRecalculo(cambios);
    }
    // Mount-only: the point is detecting what changed SINCE the last
    // visit, not on every keystroke within this same session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAcknowledgeRecalculo() {
    const vistaPrevia = getItem<Record<string, Prioridad>>(PRIORIDAD_VISTA_KEY, {});
    const siguiente = { ...vistaPrevia };
    for (const cambio of cambiosRecalculo) {
      siguiente[cambio.requisitoId] = cambio.actual;
    }
    setItem(PRIORIDAD_VISTA_KEY, siguiente);
    setCambiosRecalculo([]);
  }

  function handleCreate() {
    setEditingRequisito(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleEdit(item: Requisito) {
    setEditingRequisito(item);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleSave(data: Omit<Requisito, "id">) {
    const next = editingRequisito
      ? updateInList(requisitos, editingRequisito.id, data)
      : addToList(requisitos, data);
    persistRequisitos(next);
    setFormOpen(false);
    setEditingRequisito(null);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    persistRequisitos(removeFromList(requisitos, deleteTarget.id));
    // Also clears its entry in the seen-priority snapshot, so no ghost
    // ids linger in localStorage.
    const vistaPrevia = getItem<Record<string, Prioridad>>(PRIORIDAD_VISTA_KEY, {});
    if (deleteTarget.id in vistaPrevia) {
      const resto = { ...vistaPrevia };
      delete resto[deleteTarget.id];
      setItem(PRIORIDAD_VISTA_KEY, resto);
    }
    setDeleteTarget(null);
  }

  const exportData = requisitos.map((requisito) => ({
    ...requisito,
    prioridadAjustada: prioridadAjustadaPorId.get(requisito.id) ?? requisito.prioridadBase,
    insight: requisito.insightId
      ? insightsPorId.get(requisito.insightId)?.descripcion
      : undefined,
    segmento: requisito.segmentoId
      ? segmentosPorId.get(requisito.segmentoId)?.nombre
      : undefined,
  }));

  const sinDatosDeOtrasInterfaces = insights.length === 0 && segmentos.length === 0;

  return (
    <div className="w-full flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-4 font-medium text-ink-primary">
          Mapeo de Requerimientos
        </h1>
        <p className="text-body-sm text-ink-secondary">
          Vincula insights (Empathy Map) y segmentos (Roper Dynagram) con requisitos
          funcionales y de UX. La prioridad se recalcula sola cuando cambian los datos
          de esas dos interfaces.
        </p>
      </header>

      {/* Actions row — Figma: "trazabilidad, exportar (JSON/CSV) y nuevo
          vínculo como acción principal" */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant={vista === "trazabilidad" ? "primary" : "secondary"}
          className="w-auto"
          onClick={() => setVista((v) => (v === "lista" ? "trazabilidad" : "lista"))}
          aria-pressed={vista === "trazabilidad"}
        >
          {vista === "lista" ? "Ver trazabilidad" : "Ver lista de vínculos"}
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <ExportButton data={exportData} filename="requirements-mapping-requisitos" />
          <Button
            className="w-auto"
            onClick={handleCreate}
            disabled={insights.length === 0 && segmentos.length === 0}
          >
            + Nuevo vínculo
          </Button>
        </div>
      </div>

      <RecalculationBanner cambios={cambiosRecalculo} onAcknowledge={handleAcknowledgeRecalculo} />

      {sinDatosDeOtrasInterfaces && (
        <Card className="border-warning/40">
          <p className="text-body-sm text-ink-primary">
            Todavía no hay insights ni segmentos cargados. Captura datos primero en{" "}
            <strong>Empathy Map</strong> y <strong>Roper Dynagram</strong> — esta
            interfaz solo lee lo que esas dos ya tengan guardado.
          </p>
        </Card>
      )}

      {vista === "lista" ? (
        <section aria-labelledby="vinculos-heading" className="flex flex-col gap-3">
          <h2 id="vinculos-heading" className="text-heading-6 font-semibold text-ink-primary">
            Lista de vínculos
          </h2>

          {requisitos.length === 0 ? (
            <p className="text-body-sm text-ink-secondary">
              Todavía no hay vínculos capturados.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {requisitos.map((requisito) => (
                <li key={requisito.id}>
                  <VinculoCard
                    requisito={requisito}
                    insight={requisito.insightId ? insightsPorId.get(requisito.insightId) : undefined}
                    segmento={requisito.segmentoId ? segmentosPorId.get(requisito.segmentoId) : undefined}
                    prioridadAjustada={prioridadAjustadaPorId.get(requisito.id) ?? requisito.prioridadBase}
                    onEdit={() => handleEdit(requisito)}
                    onDelete={() => setDeleteTarget(requisito)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section aria-labelledby="trazabilidad-heading" className="flex flex-col gap-3">
          <h2 id="trazabilidad-heading" className="text-heading-6 font-semibold text-ink-primary">
            Trazabilidad: insight/segmento → requisito → decisión de arquitectura
          </h2>
          <TraceabilityView
            requisitos={requisitos}
            insights={insights}
            segmentos={segmentos}
            prioridadAjustadaPorId={prioridadAjustadaPorId}
          />
        </section>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingRequisito ? "Editar vínculo" : "Nuevo vínculo"}
      >
        <RequisitoForm
          key={formKey}
          initialValue={editingRequisito}
          insights={insights}
          segmentos={segmentos}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar vínculo"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-ink-primary">
            ¿Eliminar el vínculo &quot;{deleteTarget?.descripcion}&quot;? Esta acción no
            se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="danger" className="w-auto" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
