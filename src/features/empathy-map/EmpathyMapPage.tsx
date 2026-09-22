import { useState } from "react";
import { createStorageKey, getItem, setItem } from "../../lib/storage.ts";
import { Select } from "../../components/ui/Select.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { addToList, removeFromList, updateInList } from "../../lib/list.ts";
import { Card } from "../../components/ui/Card.tsx";
import type { Fragment, Quadrant, Subject } from "./types.ts";

const SUBJECTS_KEY = createStorageKey("empathy-map", "subjects");
const FRAGMENTS_KEY = createStorageKey("empathy-map", "fragments");
const QUADRANTS: Quadrant[] = ["dice", "hace", "piensa", "siente"];
const QUADRANT_LABELS: Record<Quadrant, string> = {
    dice: "Dice",
    hace: "Hace",
    piensa: "Piensa",
    siente: "Siente",
};
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
    function handleClassifyFragment(id: string, cuadrante: Quadrant) {
        persistFragments(updateInList(fragments, id, { estado: "clasificado", cuadrante }));
    }

    function handleUnclassifyFragment(id: string) {
        persistFragments(
            updateInList(fragments, id, { estado: "sin-clasificar", cuadrante: undefined }),
        );
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
                            <Select
                                value=""
                                onChange={(e) => handleClassifyFragment(f.id, e.target.value as Quadrant)}
                                aria-label={`Clasificar fragmento: ${f.texto}`}
                                className="w-auto"
                            >
                                <option value="" disabled>Clasificar en...</option>
                                {QUADRANTS.map((q) => (
                                    <option key={q} value={q}>{QUADRANT_LABELS[q]}</option>
                                ))}
                            </Select>
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

            <section aria-labelledby="grid-heading" className="mb-6">
                <h2 id="grid-heading" className="sr-only">Cuadrantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUADRANTS.map((q) => {
                        const notes = fragments.filter(
                            (f) => f.sujetoId === activeSubjectId && f.estado === "clasificado" && f.cuadrante === q,
                        );
                        return (
                            <Card key={q}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-heading-3 font-semibold">{QUADRANT_LABELS[q]}</h3>
                                    <span className="text-paragraph-sm text-ink-secondary">{notes.length} notas</span>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {notes.map((f) => (
                                        <li
                                            key={f.id}
                                            className="border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2"
                                        >
                                            <span>{f.texto}</span>
                                            <button
                                                type="button"
                                                aria-label={`Quitar de ${QUADRANT_LABELS[q]}: ${f.texto}`}
                                                onClick={() => handleUnclassifyFragment(f.id)}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Generador de insights: Fase 3 */}
        </div>
    );
}