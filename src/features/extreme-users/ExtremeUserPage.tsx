// src/features/extreme-users/ExtremeUsersPage.tsx
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { DataTable, type DataTableColumn } from "../../components/ui/DataTable.tsx";
import { Modal } from "../../components/ui/Modal.tsx";
import { ExportButton } from "../../components/ui/ExportButton.tsx";
import { Badge } from "../../components/ui/Badge.tsx";
import { createStorageKey, getItem, setItem } from "../../lib/storage.ts";
import { addToList, updateInList, removeFromList } from "../../lib/list.ts";
import {
  CLASSIFICATION_LABELS,
  type ExtremeUser,
  type UserClassification,
} from "./types.ts";
import { ExtremeUserForm, type ExtremeUserFormValues } from "./components/ExtremeUserForm.tsx";

const STORAGE_KEY = createStorageKey("extreme-users", "users");

// Picks a Badge color per classification
function classificationBadgeVariant(
  classification: UserClassification,
): "success" | "warning" | "neutral" {
  switch (classification) {
    case "super-experto":
      return "success";
    case "inexperto":
      return "warning";
    case "mainstream":
      return "neutral";
  }
}

export function ExtremeUsersPage() {
  const [users, setUsers] = useState<ExtremeUser[]>(() =>
    getItem<ExtremeUser[]>(STORAGE_KEY, []),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtremeUser | null>(null);

  function persistUsers(next: ExtremeUser[]) {
    setItem(STORAGE_KEY, next);
    setUsers(next);
  }

  function handleCreate() {
    setEditingUser(null);
    setIsModalOpen(true);
  }

  function handleEdit(user: ExtremeUser) {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  function handleDelete(user: ExtremeUser) {
    const confirmed = window.confirm(`Delete "${user.alias}"? This can't be undone.`);
    if (!confirmed) return;
    persistUsers(removeFromList(users, user.id));
  }

  function handleSubmit(values: ExtremeUserFormValues) {
    if (editingUser) {
      persistUsers(updateInList(users, editingUser.id, values));
    } else {
      persistUsers(addToList(users, values));
    }
    setIsModalOpen(false);
  }

  const columns: DataTableColumn<ExtremeUser>[] = [
    {
      key: "alias",
      header: "Alias",
      render: (user) => (
        <Link
          to={`/extreme-users/${user.id}`}
          className="text-primary underline underline-offset-2"
        >
          {user.alias}
        </Link>
      ),
    },
    {
      key: "classification",
      header: "Classification",
      render: (user) => (
        <Badge variant={classificationBadgeVariant(user.classification)}>
          {CLASSIFICATION_LABELS[user.classification]}
        </Badge>
      ),
    },
    { key: "skillLevel", header: "Skill (1-10)" },
    { key: "extremeNeed", header: "Extreme need" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-4 font-semibold text-ink-primary">Usuarios Extremos</h1>
        <Button className="w-auto" onClick={handleCreate}>
          Nuevo usuario
        </Button>
      </div>

      <ExportButton data={users} filename="extreme-users" />

      <Card>
        <DataTable
          columns={columns}
          data={users}
          getRowLabel={(user) => user.alias}
          emptyMessage="Todavía no hay usuarios extremos registrados."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit user" : "New extreme user"}
      >
        <ExtremeUserForm
          initialValues={editingUser}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
