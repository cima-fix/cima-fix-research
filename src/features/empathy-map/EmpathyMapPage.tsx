import { useState } from "react";
import { createStorageKey, getItem, setItem } from "../../lib/storage.ts";
import { Select } from "../../components/ui/Select.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { addToList, removeFromList, updateInList } from "../../lib/list.ts";
import { Card } from "../../components/ui/Card.tsx";
import { Badge } from "../../components/ui/Badge.tsx";
import { ExportButton } from "../../components/ui/ExportButton.tsx";
import type { Fragment, Quadrant, Subject } from "./types.ts";
import type { Insight } from "../../types/common.ts";

const SUBJECTS_KEY = createStorageKey("empathy-map", "subjects");
const FRAGMENTS_KEY = createStorageKey("empathy-map", "fragments");
const QUADRANTS: Quadrant[] = ["dice", "hace", "piensa", "siente"];
const QUADRANT_LABELS: Record<Quadrant, string> = {
    dice: "Dice",
    hace: "Hace",
    piensa: "Piensa",
    siente: "Siente",
};

const INSIGHTS_KEY = createStorageKey("empathy-map", "insights");

const TIPOS: Insight["tipo"][] = [
    "usabilidad",
    "necesidad-oculta",
    "carga-cognitiva",
    "adaptacion-manual",
    "innovacion-potencial",
];
const TIPO_LABELS: Record<Insight["tipo"], string> = {
    usabilidad: "Usabilidad",
    "necesidad-oculta": "Necesidad oculta",
    "carga-cognitiva": "Carga cognitiva",
    "adaptacion-manual": "Adaptación manual",
    "innovacion-potencial": "Innovación potencial",
};

const PRIORIDADES: Insight["prioridad"][] = ["alta", "media", "baja"];
const PRIORIDAD_LABELS: Record<Insight["prioridad"], string> = {
    alta: "Alta",
    media: "Media",
    baja: "Baja",
};
const PRIORIDAD_BADGE_VARIANT: Record<Insight["prioridad"], "danger" | "warning" | "success"> = {
    alta: "danger",
    media: "warning",
    baja: "success",
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
    const [insights, setInsights] = useState<Insight[]>(() =>
        getItem<Insight[]>(INSIGHTS_KEY, []),
    );
    const [newInsightDescripcion, setNewInsightDescripcion] = useState("");
    const [newInsightTipo, setNewInsightTipo] = useState<Insight["tipo"]>("usabilidad");
    const [newInsightPrioridad, setNewInsightPrioridad] = useState<Insight["prioridad"]>("media");

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
    function persistInsights(next: Insight[]) {
        setInsights(next);
        setItem(INSIGHTS_KEY, next);
    }

    function handleAddInsight() {
        if (!newInsightDescripcion.trim()) return;
        const next = addToList(insights, {
            sujetoId: activeSubjectId ?? undefined,
            descripcion: newInsightDescripcion.trim(),
            tipo: newInsightTipo,
            prioridad: newInsightPrioridad,
        });
        persistInsights(next);
        setNewInsightDescripcion("");
    }

    function handleRemoveInsight(id: string) {
        persistInsights(removeFromList(insights, id));
    }

    const inboxFragments = fragments.filter(
        (f) => f.sujetoId === activeSubjectId && f.estado === "sin-clasificar",
    );
    const classifiedFragments = fragments.filter(
        (f) => f.sujetoId === activeSubjectId && f.estado === "clasificado",
    );
    const subjectInsights = insights.filter((i) => i.sujetoId === activeSubjectId);

    return (
        <div className="p-6">
            <header className="flex items-center gap-4 mb-6">
                <h1 className="text-heading-2 font-bold shrink-0">Mapa de Empatía</h1>
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
                <div className="flex gap-2 flex-1 min-w-0">
                    <Input
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="Nuevo sujeto..."
                        aria-label="Nombre del nuevo sujeto"
                    />
                    <Button variant="secondary" onClick={handleAddSubject} className="w-auto shrink-0">
                        + Sujeto
                    </Button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                    <h2 id="grid-heading" className="sr-only">Cuadrantes</h2>
                    <ExportButton
                        data={classifiedFragments}
                        filename="empathy-map-fragments"
                        className="w-auto"
                    />
                </div>
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

            <section aria-labelledby="insights-heading" className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 id="insights-heading" className="text-heading-3 font-semibold">
                        Generador de insights
                    </h2>
                    <ExportButton
                        data={subjectInsights}
                        filename="empathy-map-insights"
                        className="w-auto"
                    />
                </div>
                <div className="flex gap-2 mb-3">
                    <Input
                        value={newInsightDescripcion}
                        onChange={(e) => setNewInsightDescripcion(e.target.value)}
                        placeholder="Descripción del insight..."
                        aria-label="Descripción del nuevo insight"
                    />
                    <Select
                        value={newInsightTipo}
                        onChange={(e) => setNewInsightTipo(e.target.value as Insight["tipo"])}
                        aria-label="Tipo de insight"
                        className="w-auto"
                    >
                        {TIPOS.map((t) => (
                            <option key={t} value={t}>{TIPO_LABELS[t]}</option>
                        ))}
                    </Select>
                    <Select
                        value={newInsightPrioridad}
                        onChange={(e) => setNewInsightPrioridad(e.target.value as Insight["prioridad"])}
                        aria-label="Prioridad de insight"
                        className="w-auto"
                    >
                        {PRIORIDADES.map((p) => (
                            <option key={p} value={p}>{PRIORIDAD_LABELS[p]}</option>
                        ))}
                    </Select>
                    <Button onClick={handleAddInsight}>+ Agregar insight</Button>
                </div>
                <Card>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="pb-2 text-paragraph-sm text-ink-secondary font-medium">Insight</th>
                                <th className="pb-2 text-paragraph-sm text-ink-secondary font-medium">Tipo</th>
                                <th className="pb-2 text-paragraph-sm text-ink-secondary font-medium">Prioridad</th>
                                <th className="pb-2 text-paragraph-sm text-ink-secondary font-medium">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insights.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-3 text-paragraph-sm text-ink-secondary">
                                        Aún no hay insights.
                                    </td>
                                </tr>
                            )}
                            {insights.map((i) => (
                                <tr key={i.id} className="border-b border-border last:border-0">
                                    <td className="py-2">{i.descripcion}</td>
                                    <td className="py-2">{TIPO_LABELS[i.tipo]}</td>
                                    <td className="py-2">
                                        <Badge variant={PRIORIDAD_BADGE_VARIANT[i.prioridad]}>
                                            {PRIORIDAD_LABELS[i.prioridad]}
                                        </Badge>
                                    </td>
                                    <td className="py-2">
                                        <button
                                            type="button"
                                            aria-label={`Eliminar insight: ${i.descripcion}`}
                                            onClick={() => handleRemoveInsight(i.id)}
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>
        </div>
    );
}