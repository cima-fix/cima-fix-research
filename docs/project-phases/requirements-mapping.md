# Plan de Fases — Mapeo de Requerimientos (Interfaz 6)

Documento aparte del blueprint, siguiendo la convención de blueprint.md §0
(cada responsable puede tener su propio Plan de Fases). Interfaz 6 —
`features/requirements-mapping` — responsable: Jaime Mascareño Carlos
Alberto (blueprint.md §2).

Este plan solo referencia al blueprint y a `investigacion_de_usuarios.md`
§6 — el detalle completo de campos y comportamiento vive ahí, no se
repite aquí.

## Alcance y límite

Cubre `features/requirements-mapping/` completo: tipos locales, formulario
de requisitos, vista de trazabilidad, "ley embebida" de recálculo de
prioridad, y la integración en `router.tsx` / `NavMenu.tsx` (coordinada
con el líder, blueprint.md §4).

**No cubre:**

- `Insight` ni `Segmento` — los define y captura cada responsable en su
  propia interfaz (Empathy Map: Emir Alcantar; Roper Dynagram: Troy
  Moreno). Esta interfaz solo los lee (blueprint.md §4.1).
- El acuerdo de forma exacta del contrato entre las interfaces 4, 5 y 6
  — ver sección "Acuerdo con interfaces 4 y 5" más abajo; una vez
  cerrado con Emir y Troy, se referencia aquí, no se vuelve a
  documentar en `blueprint.md`.

## Acuerdo con interfaces 4 y 5

Según blueprint.md §4.1, el contrato exacto (claves de storage, forma del
registro, cuándo se recalculan prioridades) lo acuerdan las tres personas
responsables antes de codificar a fondo. Este Plan de Fases asume lo
siguiente — **pendiente de confirmar con Emir (interface 4) y Troy
(interface 5)**:

- Claves leídas: `createStorageKey("empathy-map", "insights")` y
  `createStorageKey("roper-dynagram", "segmentos")`.
- `AsignacionSegmento` (`createStorageKey("roper-dynagram", "asignaciones")`)
  también se lee, para derivar el tamaño real de un segmento — el
  comentario de `types/common.ts` sobre `AsignacionSegmento.sujetoId` ya
  da por hecho este acuerdo entre las tres interfaces.
- "Ley embebida": la prioridad ajustada de un requisito sube cuando el
  segmento vinculado concentra ≥40% de las asignaciones reales, o baja
  a "media" entre 15–40%, tomando siempre el máximo contra la prioridad
  propia del requisito y la del insight vinculado (nunca por debajo del
  juicio propio capturado al crear el requisito). Ver
  `features/requirements-mapping/priority.ts` para el detalle.

## Fase 1 — Modelo de datos local

- **Issue:** `feat(requirements-mapping): add local data model`
- **Rama:** `feature/requirements-mapping-types`
- **Incluye:** `features/requirements-mapping/types.ts` (`Requisito`,
  `TipoRequisito`, `Prioridad`, `EstadoValidacion`).
- **Depende de:** que `Insight` (blueprint.md, ya en `main` vía #65) y
  `Segmento`/`AsignacionSegmento` existan en `types/common.ts`.
- **Estado:** completada (este documento la entrega ya lista).

## Fase 2 — Ley embebida (recálculo de prioridad)

- **Issue:** `feat(requirements-mapping): add priority recalculation`
- **Rama:** `feature/requirements-mapping-priority`
- **Incluye:** `features/requirements-mapping/priority.ts` —
  `computePrioridadAjustada()`, derivado en cada render a partir de
  `Segmento`/`AsignacionSegmento`/`Insight` reales (nunca almacenado,
  mismo patrón que `roper-dynagram/stats.ts` para el % observado —
  investigacion_de_usuarios.md, "ERROR COMÚN").
- **Depende de:** Fase 1.
- **Estado:** completada.

## Fase 3 — Formulario y CRUD de requisitos

- **Issue:** `feat(requirements-mapping): add requisito form and crud`
- **Rama:** `feature/requirements-mapping-crud`
- **Incluye:** `components/RequisitoForm.tsx`, `RequirementsMappingPage.tsx`
  con lectura/escritura vía `lib/storage.ts` y `lib/list.ts` — nunca
  acceso directo a `localStorage` (blueprint.md §8).
- **Depende de:** Fase 1 y 2.
- **Estado:** completada.

## Fase 4 — Vista de trazabilidad

- **Issue:** `feat(requirements-mapping): add traceability view`
- **Rama:** `feature/requirements-mapping-traceability`
- **Incluye:** `components/TraceabilityView.tsx` — agrupa requisitos por
  insight y por segmento de origen, mostrando la cadena insight/segmento
  → requisito → decisión de arquitectura (investigacion_de_usuarios.md
  §6).
- **Depende de:** Fase 3.
- **Estado:** completada.

## Fase 5 — Exportación e integración

- **Issue:** `feat(requirements-mapping): wire export and register route`
- **Rama:** `feature/requirements-mapping-integration`
- **Incluye:** `ExportButton` (JSON/CSV, vía `lib/export.ts`); alta de
  ruta en `router.tsx` y entrada en `NavMenu.tsx` (coordinado con el
  líder, blueprint.md §4).
- **Depende de:** Fase 3 y 4.
- **Estado:** completada.

## Fase 6 — Datos reales

- **Issue:** `docs(field-research): confirm requirements-mapping dataset`
- **Depende de:** que Empathy Map y Roper Dynagram tengan insights y
  segmentos reales cargados desde `docs/field-research/` (blueprint.md
  §9) — esta interfaz no genera datos propios de campo, solo requisitos
  derivados de los que ya existan.
- **Estado:** pendiente — bloqueada por la carga real de las otras dos
  interfaces, no por código propio.
