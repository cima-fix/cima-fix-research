# Blueprint Técnico — Cima Fix Research

| Metadato             | Valor                         |
| -------------------- | ----------------------------- |
| Versión              | v1.0.0                        |
| Estado               | Activo                        |
| Última actualización | 2026-09-06                    |
| Autor                | Mike Armando Montano Valencia |

---

## Historial de cambios

| Versión | Fecha      | Autor                         | Cambios                                 |
| ------- | ---------- | ----------------------------- | --------------------------------------- |
| v1.0.0  | 2026-09-06 | Mike Armando Montano Valencia | Versión inicial, lista para desarrollo. |

---

## 0. Introducción

Este documento es la fuente única de verdad para empezar a construir **Cima Fix Research**: qué se va a construir, con qué tecnologías, cómo se organiza el repositorio y qué convenciones sigue todo el equipo. Cada integrante debe leerlo completo antes de escribir código.

Este documento **no** repite los campos que debe capturar cada interfaz — eso ya está definido en [`investigacion_de_usuarios.md`](./investigacion_de_usuarios.md) y se referencia desde aquí, no se copia.

Una vez que cada integrante del proyecto identifique su interfaz en la sección 2, puede comenzar a crear su propio **Plan de Fases** — un documento aparte, más detallado, específico de su interfaz.

## 1. Resumen del proyecto

Cima Fix Research es una suite de 6 interfaces web, una por cada método de investigación de usuarios visto. Es un proyecto complementario a la app Cima Fix (el sistema de reportes de mantenimiento del campus), en donde este sirve como un sistema de organización y representación de las investigaciones (entrevistas, encuestas, etc.) realizadas para el desarrollo de Cima Fix. Cima Fix Research es distinto de la app Cima Fix — comparte equipo y parte del stack, pero no código, base de datos ni infraestructura.

Cada interfaz es una herramienta de captura funcional (no un mockup): cada interfaz se usará para registrar los datos de las entrevistas/observaciones reales.

División de trabajo:

- **6 integrantes** construyen, cada uno, una de las 6 interfaces.
- **El líder — Mike Armando Montano Valencia —** se encarga de: la investigación de campo y consolidación de datos reales (fuera del alcance de este documento), este blueprint, y el scaffolding inicial del repositorio (estructura base, router, componentes compartidos y la página de entrada / landing page de la aplicación).

## 2. Interfaces y responsables

| #   | Interfaz                 | Carpeta / ruta                  | Responsable                        | Detalle de campos                 |
| --- | ------------------------ | ------------------------------- | ---------------------------------- | --------------------------------- |
| 1   | Entrevista a Expertos    | `features/expert-interviews`    | *Zazueta Medrano Aidan*            | `investigacion_de_usuarios.md` §1 |
| 2   | Usuarios Extremos        | `features/extreme-users`        | *Meza Espinoza Kevin Andre*        | `investigacion_de_usuarios.md` §2 |
| 3   | Needfinding (El Iceberg) | `features/needfinding`          | *Perez Aguirre Mextli Citlali*     | `investigacion_de_usuarios.md` §3 |
| 4   | Empathy Map (The Parser) | `features/empathy-map`          | *Alcantar Martinez Emir Alexander* | `investigacion_de_usuarios.md` §4 |
| 5   | Roper Dynagram           | `features/roper-dynagram`       | *Moreno Calderon Troy Leonardo*    | `investigacion_de_usuarios.md` §5 |
| 6   | Mapeo de Requerimientos  | `features/requirements-mapping` | *Jaime Mascareño Carlos Alberto*   | `investigacion_de_usuarios.md` §6 |

> Como no hay backend en este proyecto (ver sección 3), el rol previo de cada quien en Cima Fix (backend/frontend/QA/etc.) no determina qué interfaz le toca aquí — las 6 son trabajo de frontend por igual. La asignación puede hacerse libremente.

## 3. Stack tecnológico

| Capa                                  | Tecnología                                                                                                                                          | Justificación                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend                              | React ≥19.2.5 + Vite ≥7 (Vite 8 vigente) + TypeScript + Tailwind v4 (`@tailwindcss/vite`)                                                           | Mismo stack de frontend que Cima Fix — el equipo ya lo conoce, cero curva de aprendizaje nueva, y cumple el requisito de "framework consistente en toda la suite".                                                                                                                                                                                       |
| Ruteo                                 | React Router                                                                                                                                        | Estándar de facto para ruteo de cliente en React. Instalar la major vigente (v8 al momento de escribir este documento) — v6 está en End of Life. El paquete es react-router (no react-router-dom).                                                                                                                                                       |
| Persistencia                          | `localStorage` (default), con `idb-keyval` como respaldo si alguna interfaz necesita guardar más datos de los que `localStorage` maneja cómodamente | Cada interfaz es una herramienta de un solo usuario, sin datos compartidos entre personas — no hay justificación para un backend. `localStorage` es síncrono y trivial de usar (`JSON.stringify`/`parse`); se cambia a IndexedDB solo si una interfaz específica lo necesita, no por defecto.                                                            |
| Exportación JSON/CSV                  | Utilidades propias en `lib/export.ts` (sin librería)                                                                                                | El volumen de datos es pequeño (mínimo 4 usuarios reales); no se justifica una dependencia externa para esto.                                                                                                                                                                                                                                            |
| Visualización — grid Empathy Map      | CSS Grid puro                                                                                                                                       | Es una cuadrícula 2×2, no requiere librería de charts.                                                                                                                                                                                                                                                                                                   |
| Visualización — rueda Roper Dynagram  | **Recharts** v3                                                                                                                                     | Esta visualización sí requiere una librería (proporciones recalculadas dinámicamente en un gráfico polar/donut). Recharts es la opción más usada con React para este tipo de gráfico. Verificar la resolución del peer dependency react-is contra la versión exacta de React instalada — es un punto de fricción conocido de esta librería con React 19. |
| Backend / BD / Auth / Storage / Email | **Ninguno**                                                                                                                                         | Sin justificación funcional: no hay múltiples usuarios compartiendo datos, no hay archivos binarios grandes, no hay necesidad de login. Agregar cualquiera de estas piezas sería complejidad no pedida por la tarea.                                                                                                                                     |
| Lint / formato                        | ESLint v10 + Prettier (config incluida en el scaffolding). Usar flat config (`eslint.config.js`)                                                    | Una sola configuración compartida para que el código de las 6 personas sea consistente.                                                                                                                                                                                                                                                                  |

## 4. Estructura del repositorio

```
cima-fix-research/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Input, FormField, DataList, Modal, ExportButton...
│   │   └── layout/           # AppShell, NavMenu
│   ├── router.tsx
│   ├── App.tsx
│   ├── main.tsx          # importa ./index.css
│   ├── index.css         # @import "tailwindcss"; + bloque @theme (sección 7)
│   ├── features/
│   │   ├── expert-interviews/
│   │   ├── extreme-users/
│   │   ├── needfinding/
│   │   ├── empathy-map/
│   │   ├── roper-dynagram/
│   │   └── requirements-mapping/
│   ├── lib/
│   │   ├── storage.ts        # wrapper sobre localStorage (get/set tipado)
│   │   ├── export.ts         # exportToJSON(), exportToCSV()
│   │   └── validation.ts     # helpers de validación reutilizables
│   └── types/
│       └── common.ts         # tipos compartidos entre interfaces (mínimos)
├── docs/                  # documentación del proyecto
├── index.html
├── vite.config.ts
├── eslint.config.js       # flat config
├── .nvmrc
├── .npmrc                 # engine-strict=true
├── package.json
├── tsconfig.json          # referencia a tsconfig.app.json y tsconfig.node.json
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md
```

Convención por interfaz (dentro de cada carpeta en `features/`):

```
features/<nombre-interfaz>/
├── <Nombre>Page.tsx     # punto de entrada, lo que engancha el router
├── types.ts              # modelo de datos específico de esta interfaz
└── components/           # sub-componentes propios (solo si hacen falta)
```

**Límites de propiedad**, para minimizar conflictos de merge trabajando en paralelo:

- Cada quien trabaja **únicamente dentro de su carpeta** en `features/`.
- `components/ui/`, `lib/`, `router.tsx`, `index.css` y `App.tsx` son compartidos — los entrega el scaffolding inicial. Si alguien necesita un componente nuevo ahí, se coordina adecuadamente en vez de editarlo directamente.

## 4.1 Contrato de datos entre interfaces (Empathy Map ↔ Roper Dynagram ↔ Mapeo de Requerimientos)

Las interfaces 1, 2, 3, 4 y 5 son autocontenidas: cada una captura y estructura su propio dato sin necesitar nada de otra interfaz, así que el aislamiento por carpeta de la sección 4 aplica sin excepción. La única que rompe ese aislamiento es la **interfaz 6**, que necesita leer insights (que produce la 4) y segmentos (que produce la 5) para poder vincularlos con requisitos. Por ser una excepción puntual, estas dos reglas se fijan aquí:

| Dato       | Dueño (escribe) | Quién lee                 | Dónde vive el tipo |
| ---------- | --------------- | ------------------------- | ------------------ |
| `Insight`  | Interfaz 4      | Interfaz 6 (solo lectura) | `types/common.ts`  |
| `Segmento` | Interfaz 5      | Interfaz 6 (solo lectura) | `types/common.ts`  |

1. `Insight` y `Segmento` se definen en `types/common.ts`, no dentro de `features/empathy-map/` ni `features/roper-dynagram/` — si no, la interfaz 6 tendría que importar directamente de la carpeta de otra persona.
2. La interfaz 6 solo **lee** estos datos (vía `lib/storage.ts`); nunca escribe en el storage de la 4 ni de la 5.

El resto del contrato — campos exactos, claves de `localStorage`, cuándo se recalculan prioridades al cambiar un segmento — lo acuerdan y documentan **entre las tres personas responsables (4, 5, 6)**, antes de codificar a fondo. El resultado va en sus Planes de Fases (o un mini-acuerdo compartido entre las tres referenciado desde ahí); no se repite en este documento.

## 5. Convenciones de código

- Componentes React: `PascalCase.tsx`. Funciones/variables: `camelCase`. Carpetas: `kebab-case`.
- TypeScript en modo estricto.
- Commits, ramas y pull requests: ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) — la rúbrica evalúa el historial de commits directamente, así que conviene cuidar ese flujo con especial atención en este proyecto.

## 6. Componentes base compartidos (entregados en el scaffolding)

Para que las 6 interfaces se vean y comporten de forma consistente sin que cada quien reinvente lo mismo:

- `Button`, `Input`, `TextArea`, `Select`
- `FormField` (label + mensaje de error)
- `Card`
- `Badge` (variantes success / danger / warning / neutral, construidas solo con los tokens de la sección 7 — `success`/`danger`/`warning` usan las variables CSS semánticas, `neutral` usa los grises fijos de "Superficies neutrales") — usado por clasificaciones de usuario, potencial de innovación, prioridad y estado de validación
- `DataList` / `DataTable` (listado con acciones editar/eliminar)
- `Modal` (confirmación de eliminar, formularios de creación/edición)
- `ExportButton` (dispara `exportToJSON` / `exportToCSV` de `lib/export.ts`)
- `AppShell` + `NavMenu` (layout y navegación entre las 6 interfaces)

El scaffolding incluye además **la página de entrada (landing page)** de la aplicación, ya implementada con estos componentes, como ejemplo de uso a seguir — no hace falta describir el patrón en texto aquí, se lee directamente del código.

## 7. Guía de diseño (Design Tokens)

No hay diseño previo en Figma, así que se define aquí una base mínima para no bloquear a nadie. Es una **propuesta inicial ajustable** — si alguien quiere definir otros valores, se reemplaza aquí antes de empezar a codificar, no después.

**Tipografía** (clases de Tailwind, fuente por defecto de Tailwind — `font-sans`):

| Elemento                  | Clase Tailwind                         | Uso                                    |
| ------------------------- | -------------------------------------- | -------------------------------------- |
| H1                        | `text-3xl font-bold text-gray-900`     | Título de cada interfaz                |
| H2                        | `text-2xl font-semibold text-gray-900` | Secciones dentro de una interfaz       |
| H3                        | `text-xl font-semibold text-gray-900`  | Subsecciones / nombres de tarjeta      |
| Cuerpo                    | `text-base text-gray-900`              | Texto normal, contenido de formularios |
| Texto secundario / labels | `text-sm text-gray-500`                | Etiquetas, ayudas, metadatos           |

**Colores** (declarados como variables CSS en `src/index.css`, vía `@theme` de Tailwind v4 — nadie usa clases directas de color semántico/marca como `bg-blue-600`, solo estos nombres; los neutros van aparte, ver la tabla de abajo):

| Variable                | Rol semántico                                                                                                                          | Valor     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `--color-primary`       | Acción primaria (botones, links, navegación activa)                                                                                    | *#002e6b* |
| `--color-primary-hover` | Estado hover/active de `--color-primary`                                                                                               | *#00449e* |
| `--color-surface`       | Fondo de `Card` y `Modal` — un tono más oscuro que `--color-background` para que la superficie elevada se distinga del fondo de página | *#F6F6F6* |
| `--color-success`       | Éxito / validado                                                                                                                       | *#1A7A53* |
| `--color-danger`        | Error / eliminar                                                                                                                       | *#942525* |
| `--color-danger-hover`  | Hover para Error / eliminar                                                                                                            | *#7a1e1e* |
| `--color-warning`       | Advertencia                                                                                                                            | *#d29034* |
| `--color-warning-text`  | Texto oscuro para usar sobre `--color-warning`                                                                                         | *#3a2405* |
| `--color-background`    | Fondo de página (todas las interfaces)                                                                                                 | *#FBFBFB* |

**Superficies neutrales** (clases de Tailwind fijas, sin variable — mismo valor en las 6 interfaces):

| Elemento                          | Clase Tailwind    | Uso                                                     |
| --------------------------------- | ----------------- | ------------------------------------------------------- |
| Borde de tarjeta / divisores      | `border-gray-200` | Bordes sutiles en `Card`, `Modal`, separadores de lista |
| Fondo alterno / hover de fila     | `bg-gray-50`      | Hover en filas de `DataList` / `DataTable`              |
| Texto deshabilitado / placeholder | `text-gray-400`   | Placeholder de inputs, estados disabled                 |
| Fondo deshabilitado               | `bg-gray-100`     | Inputs y botones en estado disabled                     |

Estos tonos de gris —los de texto (tabla de Tipografía) y los de esta tabla— quedan fijos para toda la suite: ningún responsable de interfaz elige los suyos. No se declaran como variable CSS porque no cumplen un rol semántico ni de marca, solo son grises de UI.

**Colores adicionales específicos de una interfaz.** Los tokens de arriba son la base obligatoria para las 6 interfaces. Si una interfaz necesita un color que estos tokens no cubren —por ejemplo, para distinguir categorías propias, un botón, una tarjeta o cualquier otro elemento que decida agregar— su responsable puede definir colores adicionales. El caso más claro es la rueda del Roper Dynagram, donde el número de segmentos depende de cuántos resulten al cargar los datos reales de la investigación.

Reglas para esta excepción:

- Se declaran en la carpeta de la interfaz (`features/<nombre-interfaz>/`), no en `src/index.css` (compartido; no se toca sin coordinar con el líder).
- Se usan únicamente dentro de esa interfaz: no reemplazan ni conviven con los tokens base en las otras interfaces.
- No sustituyen a `--color-success` / `--color-danger` / `--color-warning`, que siguen siendo exclusivos para comunicar estado (éxito, error, advertencia) en cualquier interfaz.

Estas clases se utilizan dentro de cada componente de `components/ui/` (`Button`, `Input`, `Card`, `FormField`, `Badge`, etc.); es responsabilidad de su implementación en el código — no se repite aquí.

## 8. Requisitos técnicos comunes (checklist para las 6 interfaces)

Además de los requisitos ya definidos en `investigacion_de_usuarios.md`
(CRUD con listas dinámicas, validación de campos, accesibilidad y diseño
responsivo — ver "Interfaces a desarrollar" y "Requisitos técnicos"),
cada interfaz debe:

- Persistencia vía `lib/storage.ts` (no acceso directo a `localStorage`)
- Exportación a JSON y CSV vía `lib/export.ts` (no librería externa)
- Uso de los componentes de `components/ui/` (no HTML plano ni estilos sueltos)
- Integrada en `router.tsx` y `NavMenu` (coordinar con el líder al agregarla)

## 9. Datos: prueba vs. reales

Durante el desarrollo, cada quien usa datos ficticios para probar su interfaz — no hace falta esperar a tener entrevistas reales para empezar a codificar. El líder consolidará las entrevistas y observaciones reales y las cargará en cada interfaz antes de la entrega final. Esto no bloquea el desarrollo de nadie.

## 10. Nivel de "terminado" y despliegue

Mínimo indispensable: las 6 interfaces corren localmente (`npm run dev`) desde un único repositorio, con navegación entre todas desde el menú.

Recomendación: dado que no hay backend, desplegar el build estático (Vercel, Netlify o GitHub Pages) tiene costo casi nulo — es literalmente subir el `dist/` generado por Vite — y facilita la demo en vivo durante la exposición. Se propone como algo deseable pero no obligatorio; no debe bloquear el desarrollo de ninguna interfaz.