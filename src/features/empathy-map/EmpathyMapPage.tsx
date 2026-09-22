import { useState } from "react";
import { createStorageKey, getItem, setItem } from "../../lib/storage.ts";
import { addToList, removeFromList } from "../../lib/list.ts";
import { Select } from "../../components/ui/Select.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import type { Fragment, Subject } from "./types.ts";

const SUBJECTS_KEY = createStorageKey("empathy-map", "subjects");
const FRAGMENTS_KEY = createStorageKey("empathy-map", "fragments");

export function EmpathyMapPage() {
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getItem<Subject[]>(SUBJECTS_KEY, []),
  );
  const [fragments, setFragments] = useState<Fragment[]>(() =>
    getItem<Fragment[]>(FRAGMENTS_KEY, []),
  );
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(() => {
    const loaded = getItem<Subject[]>(SUBJECTS_KEY, []);
    return loaded[0]?.id ?? null;
  });
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newFragmentText, setNewFragmentText] = useState("");

  function persistSubjects(next: Subject[]) {
    setSubjects(next);
    setItem(SUBJECTS_KEY, next);
  }

  function persistFragments(next: Fragment[]) {
    setFragments(next);
    setItem(FRAGMENTS_KEY, next);
  }

  function handleAddSubject() {
    if (!newSubjectName.trim()) return;
    const next = addToList(subjects, { nombre: newSubjectName.trim() });
    persistSubjects(next);
    setActiveSubjectId(next[next.length - 1].id);
    setNewSubjectName("");
  }

  function handleAddFragment() {
    if (!newFragmentText.trim() || !activeSubjectId) return;
    const next = addToList(fragments, {
      sujetoId: activeSubjectId,
      texto: newFragmentText.trim(),
      estado: "sin-clasificar",
    });
    persistFragments(next);
    setNewFragmentText("");
  }

  function handleRemoveFragment(id: string) {
    persistFragments(removeFromList(fragments, id));
  }

  const inboxFragments = fragments.filter(
    (f) => f.sujetoId === activeSubjectId && f.estado === "sin-clasificar",
  );

  return (
    <div className="p-6">
      <header className="flex items-center gap-4 mb-6">
        <h1 className="text-heading-2 font-bold">Mapa de Empatía</h1>
        <label className="flex items-center gap-2">
          <span className="text-paragraph">Sujeto</span>
          <Select
            value={activeSubjectId ?? ""}
            onChange={(e) => setActiveSubjectId(e.target.value)}
            aria-label="Seleccionar sujeto"
          >
            <option value="" disabled>Selecciona un sujeto</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </Select>
        </label>
        <Input
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Nuevo sujeto..."
          aria-label="Nombre del nuevo sujeto"
        />
        <Button variant="secondary" onClick={handleAddSubject}>
          + Sujeto
        </Button>
      </header>

      <section aria-labelledby="inbox-heading" className="mb-6">
        <h2 id="inbox-heading" className="text-heading-3 font-semibold mb-2">
          Bandeja de entrada
        </h2>
        <div className="flex gap-2 mb-3">
          <Input
            value={newFragmentText}
            onChange={(e) => setNewFragmentText(e.target.value)}
            placeholder="Nuevo fragmento..."
            aria-label="Texto del nuevo fragmento"
            disabled={!activeSubjectId}
          />
          <Button onClick={handleAddFragment} disabled={!activeSubjectId}>
            Agregar
          </Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {inboxFragments.map((f) => (
            <li key={f.id} className="border border-border rounded-md px-3 py-2 flex items-center gap-2">
              <span>{f.texto}</span>
              <button
                type="button"
                aria-label={`Eliminar fragmento: ${f.texto}`}
                onClick={() => handleRemoveFragment(f.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Cuadrícula 2x2 y generador de insights: Fase 2 y 3 */}
    </div>
  );
}