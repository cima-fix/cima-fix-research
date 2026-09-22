// features/expert-interviews/ExpertInterviewsPage.tsx
// "Expert Interview" interface entry point.
// Lists recorded interviews; allows for creating, editing, deleting, and exporting.

import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "../../components/ui/Badge.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable.tsx";
import { ExportButton } from "../../components/ui/ExportButton.tsx";
import { Modal } from "../../components/ui/Modal.tsx";
import { addToList, removeFromList, updateInList } from "../../lib/list.ts";
import { createStorageKey, getItem, setItem } from "../../lib/storage.ts";
import { ExpertInterviewForm } from "./components/ExpertInterviewForm.tsx";
import type { ExpertInterview } from "./types.ts";

const STORAGE_KEY = createStorageKey("expert-interviews", "interviews");

const columns: DataTableColumn<ExpertInterview>[] = [
  {
    key: "id",
    id: "alias",
    header: "Alias",
    render: (item) => (
      <Link
        to={`/expert-interviews/${item.id}`}
        className="text-primary underline underline-offset-2"
      >
        {item.perfil.alias}
      </Link>
    ),
  },
  {
    key: "id",
    id: "rol-dominio",
    header: "Rol / Dominio",
    render: (item) => `${item.perfil.rol} — ${item.perfil.dominio}`,
  },
  {
    key: "id",
    id: "fecha",
    header: "Fecha",
    render: (item) => item.perfil.fecha || "—",
  },
  {
    key: "id",
    id: "medio",
    header: "Medio",
    render: (item) => (
      <Badge variant={item.perfil.medio === "presencial" ? "success" : "neutral"}>
        {item.perfil.medio}
      </Badge>
    ),
  },
];

export function ExpertInterviewsPage() {
  const [interviews, setInterviews] = useState<ExpertInterview[]>(() =>
    getItem<ExpertInterview[]>(STORAGE_KEY, []),
  );
  const [editing, setEditing] = useState<ExpertInterview | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExpertInterview | null>(null);

  function persist(next: ExpertInterview[]) {
    setInterviews(next);
    setItem(STORAGE_KEY, next);
  }

  function handleCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(item: ExpertInterview) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleSave(data: Omit<ExpertInterview, "id">) {
    persist(
      editing ? updateInList(interviews, editing.id, data) : addToList(interviews, data),
    );
    setFormOpen(false);
    setEditing(null);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    persist(removeFromList(interviews, deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-heading-4 font-medium text-ink-primary">
          Entrevista a Expertos
        </h1>
        <Button className="w-auto" onClick={handleCreate}>
          Nueva entrevista
        </Button>
      </div>

      <ExportButton data={interviews} filename="entrevistas-expertos" />

      <Card>
        <DataTable
          columns={columns}
          data={interviews}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          getRowLabel={(item) => item.perfil.alias || "entrevista"}
          emptyMessage="Todavía no hay entrevistas registradas."
        />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Editar entrevista" : "Nueva entrevista"}
      >
        <ExpertInterviewForm
          key={editing?.id ?? "new"}
          initialValue={editing}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar entrevista"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-ink-primary">
            ¿Eliminar la entrevista a &quot;{deleteTarget?.perfil.alias}&quot;? Esta
            acción no se puede deshacer.
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
            <Button
              type="button"
              variant="danger"
              className="w-auto"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}