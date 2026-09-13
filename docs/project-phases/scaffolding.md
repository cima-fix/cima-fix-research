# Plan de Fases — Scaffolding Inicial (Líder)

Documento aparte del blueprint, siguiendo la convención de blueprint.md §0 (cada responsable puede tener su propio Plan de Fases).

Este plan solo referencia al blueprint — el detalle completo de cada entregable vive ahí, no se repite aquí.

## Alcance y límite

Cubre el scaffolding inicial del líder (blueprint.md §1): `lib/`, tokens (`index.css`), `components/ui/`, `components/layout/`, `router.tsx`, `App.tsx` y la landing page. La "estructura base" no es una fase aparte: es el resultado de ir completando las Fases 1 a 6.

**No cubre:**
- Las 6 interfaces de `features/*` — responsabilidad individual (blueprint.md §2), cada una con su propio Plan de Fases.
- Contenido de `types/common.ts` (blueprint.md §4.1).
- Investigación de campo y datos reales (blueprint.md §1, §9).
- El propio `blueprint.md` (blueprint.md §1).
- Ajustes de GitHub de `repository-config.md` (no listados en blueprint.md §1).

Coordinación posterior con los 6 responsables sobre archivos compartidos y altas de ruta: blueprint.md §4 y §8.

---

## Fase 0 — Tooling del proyecto

- **Issue:** `chore: initial repository scaffolding (tooling only)`
- **Rama:** `chore/scaffolding`
- **Incluye:** Vite 8 + React 19 + TypeScript estricto + Tailwind v4 + ESLint v10 (flat config) + Prettier + React Router, `engines`/`.nvmrc`/`.npmrc`.
- **Estado:** completada.

## Fase 1 — Utilidades compartidas

- **Issue:** `feat(lib): add shared data utilities`
- **Rama:** `feature/shared-lib`
- **Incluye:** `lib/storage.ts`, `lib/list.ts`, `lib/export.ts`, `lib/validation.ts` (blueprint.md §3, §4).
- **Depende de:** Fase 0.
- **Estado:** completada.

## Fase 2 — Tokens de diseño

- **Issue:** `chore(theme): sync design tokens from figma`
- **Rama:** `chore/design-tokens`
- **Incluye:** bloque `@theme` en `index.css`, sincronizado con Figma (blueprint.md §7).
- **Depende de:** Fase 0.
- **Estado:** completada.

## Fase 3 — Kit de UI base

- **Issue:** `feat(ui): add base ui kit`
- **Rama:** `feature/ui-kit-base`
- **Incluye:** `Button`, `Input`, `TextArea`, `Select`, `FormField`, `Card`, `Badge` (blueprint.md §6).
- **Nota:** blueprint.md v1.4.0 agregó `lib/cn.ts` (clsx + tailwind-merge) como utilidad requerida — se entrega en esta fase, no en la fase 1 (ya completada), ya que el blueprint la definió después.
- **Depende de:** Fase 2.
- **Estado:** completada.

## Fase 4 — Kit de UI avanzado

- **Sub-issues** (CONTRIBUTING.md — dividir si no cabe en un PR razonable):
  - `feat(ui): add datatable component` → `feature/ui-datatable`
  - `feat(ui): add modal component` → `feature/ui-modal`
  - `feat(ui): add export button component` → `feature/ui-export-button`
- **Incluye:** `DataList`/`DataTable`, `Modal`, `ExportButton` (blueprint.md §6).
- **Depende de:** Fase 1 (ExportButton) y Fase 3.
- **Estado:** pendiente.

## Fase 5 — Layout y navegación

- **Issue:** `feat(layout): add navigable app shell`
- **Rama:** `feature/app-shell`
- **Incluye:** `AppShell`, `NavMenu`, `router.tsx`, `App.tsx` (blueprint.md §4, §6).
- **Depende de:** Fase 2.
- **Estado:** pendiente.

## Fase 6 — Página de entrada

- **Issue:** `feat(landing): add landing page`
- **Rama:** `feature/landing-page`
- **Incluye:** landing page con los componentes de las Fases 3–5, como ruta índice en `router.tsx` (blueprint.md §6).
- **Depende de:** Fase 3, 4 y 5.
- **Nota:** blueprint.md no define dónde vive el archivo de esta página (sí lo hace para las 6 interfaces, §4) — decisión de implementación de esta fase.
- **Estado:** pendiente. Cierra la responsabilidad de scaffolding del líder (blueprint.md §1).
