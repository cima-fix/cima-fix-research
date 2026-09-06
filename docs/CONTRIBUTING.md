# Contribuir a Cima Fix Research

Guía para el equipo: cómo levantar el proyecto localmente y qué convenciones seguir para commits, ramas y pull requests. Estructura de carpetas, componentes compartidos y demás flujos de trabajo: ver [`blueprint.md`](./blueprint.md).

---

## Desarrollo local

### Requisitos previos

- Node.js (Active LTS vigente — línea 24.x; versión exacta fijada en `.nvmrc` y en el campo `engines` de `package.json`)
- npm (versión fijada junto con Node.js en el mismo campo `engines`)
- Git

El repositorio fija `engine-strict=true` en `.npmrc`: `npm install` se rechaza si la versión instalada de Node o npm no cumple lo declarado en `engines` — no es solo una convención documentada, se hace cumplir automáticamente.

### Instalación

```bash
git clone <url-del-repositorio>
cd cima-fix-research
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación queda disponible en la URL que indique la terminal de Vite (por defecto `http://localhost:5173`).

---

## Convención de commits, ramas y pull requests

Esta sección está escrita en términos genéricos, sin referencias a un proyecto en particular.

### Issues

El repositorio vive dentro de una organización de GitHub; tanto el acceso al repositorio como al Project del equipo dependen de la membresía en esa organización.

#### Cuándo crear un issue

- **Obligatorio** para `feat` y `fix`: son los tipos que cambian el comportamiento, y son justo lo que un Project necesita rastrear. El issue se vincula al PR que lo resuelve (ver [Pull Requests](#pull-requests)) y se cierra solo al fusionar, sin actualizar el tablero a mano.
- **Opcional** para el resto de los tipos (`chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`): son cambios de mantenimiento sin impacto en el comportamiento — exigir un issue para, por ejemplo, corregir una errata en el README es más proceso del que el cambio amerita.

Si un issue abarca más de lo que cabe en un PR razonable, se divide en sub-issues más chicos antes de empezar: permite avanzar en incrementos manejables y termina en pull requests más chicos y más fáciles de revisar.

#### Crear el issue

El título sigue el mismo formato que un commit (ver [Formato del mensaje](#formato-del-mensaje)): issue, PR y commit comparten un único formato de título.

```bash
gh issue create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving."
```

Si el equipo usa un GitHub Project para dar seguimiento visual al trabajo, `--project <nombre>` agrega el issue ahí directamente al crearlo (requiere autorizar el scope `project` una sola vez: `gh auth refresh -s project`).

### Commits

#### Formato del mensaje

Idioma: inglés. Es el estándar de facto para commits, código y comentarios, independientemente del idioma de trabajo del equipo.

```
<type>(<optional scope>): <short description in lowercase, no trailing period>

[optional body — explains the "why", the context]

[optional footer — external links, issue references, and other meta-information]
```

El cuerpo y el footer sirven como documentación mientras se desarrolla la rama — visibles en `git log` y en la pestaña "Commits" del PR (ver [Pull Requests](#pull-requests) sobre qué se conserva al fusionar).

#### Tipos

| Tipo       | Cuándo usarlo                                                                   |
| ---------- | ------------------------------------------------------------------------------- |
| `feat`     | Nueva funcionalidad visible para la persona usuaria o la API                    |
| `fix`      | Corrección de un bug                                                            |
| `chore`    | Tareas de mantenimiento sin efecto en el comportamiento (deps, config, scripts) |
| `docs`     | Cambios solo de documentación (README, comentarios)                             |
| `refactor` | Cambio de código que no arregla un bug ni agrega funcionalidad                  |
| `test`     | Agregar o corregir pruebas                                                      |
| `style`    | Formato, espacios, punto y coma — sin cambio de lógica                          |
| `perf`     | Cambio que mejora rendimiento                                                   |
| `ci`       | Cambios en workflows / configuración de integración continua                    |

#### Scope

Opcional pero recomendado. Generalmente corresponde a un módulo, componente o área funcional definida en la documentación técnica del proyecto (arquitectura, blueprint técnico, SDD, etc.) — por ejemplo `auth`, `api`, `ui`, `storage`. También puede ser una etiqueta corta libre que describa el área tocada sin corresponder a un módulo formal (ej. `deps`).

Si el proyecto cuenta con documentos de requisitos con identificadores únicos (SRS, historias de usuario, tickets — incluyendo issues de GitHub, ver [Issues](#issues)), y el commit implementa uno puntual, referenciar ese identificador en la descripción del commit ayuda a mantener trazabilidad.

Cuando varias funcionalidades pertenecen conceptualmente a un mismo grupo definido en la arquitectura del proyecto (por ejemplo, un panel compartido por varias entidades), se usa el nombre de ese grupo como scope en lugar del nombre puntual de la entidad que se esté tocando en ese commit — mantiene el scope alineado con la arquitectura documentada, no con la superficie del cambio.

#### Breaking changes

Si un commit rompe compatibilidad (ej. cambia la forma de una respuesta ya en uso), se agrega `!` después del tipo/scope:

```
feat(api)!: rename `id` field to `userId` in response payload
```

El impacto debe describirse en la descripción del PR (ver [Pull Requests](#pull-requests)). Opcionalmente, si ayuda a documentar el porqué mientras la rama sigue en desarrollo, el cuerpo del commit puede incluir una nota breve al respecto.

#### Ejemplos

```
feat(auth): add password reset flow
fix(export): correct csv escaping for fields containing commas
chore: initial project scaffolding
chore(deps): bump vite to 6.0
docs: add installation instructions to readme
refactor(storage): extract local persistence logic into shared module
test(validation): cover required-field edge cases
```

#### Reglas rápidas

- Descripción corta en modo imperativo presente ("add", "fix", "remove"), no en pasado ni en tercera persona. Regla mental: el mensaje completa la frase "If applied, this commit will ___".
- Sin punto final en la línea de descripción.
- Un commit = un cambio lógico. Si la descripción necesita un "and", probablemente son dos commits.

### Ramas

#### Nombrado

```
<prefijo>/<descripción corta en kebab-case>
```

El prefijo coincide con el tipo que tendrá el PR, salvo `feat`, que usa `feature/` en vez de `feat/`.

| Tipo de commit                                     | Prefijo de rama             | Ejemplo                                        |
| -------------------------------------------------- | --------------------------- | ---------------------------------------------- |
| `feat`                                             | `feature/`                  | `feature/user-profile`                         |
| `chore`, `docs`, `refactor`, `test`, `style`, etc. | mismo nombre del tipo + `/` | `chore/update-dependencies`, `docs/api-readme` |

#### Crear una rama

Si el trabajo tiene un issue (ver [Issues](#issues)), la rama se crea vinculada a ese issue, usando `--name` para respetar el nombrado de la sección anterior:

```bash
gh issue develop <número-de-issue> --name feature/example --checkout
```

Por defecto esto crea la rama en el repositorio actual a partir de la rama default (`main`) y la deja lista localmente — no hace falta actualizar `main` a mano primero.

Sin issue (caso opcional descrito en [Issues](#issues)), la rama se crea de la forma tradicional:

```bash
git checkout main
git pull origin main
git checkout -b chore/example
```

- `git pull origin main` evita partir de una versión vieja de `main` — de lo contrario, el PR puede terminar rechazado si el repositorio exige que la rama esté actualizada.

### Pull Requests

#### Título y descripción

- El **título** sigue el mismo formato que un commit (ver [Formato del mensaje](#formato-del-mensaje)) — al hacer squash merge, se convierte en el mensaje del commit final en `main`.
- La **descripción** se conserva como cuerpo del commit final — ahí va el contexto que se quiere preservar permanentemente, incluyendo el detalle de un breaking change.
- Ambos quedan para siempre en el historial de `main`: vale la pena escribirlos con cuidado en vez de dejarlos en automático.

#### Crear el PR

Si el PR resuelve un issue, la descripción incluye la palabra clave de cierre correspondiente (`Closes #<número>`, `Fixes #<número>` o `Resolves #<número>`). Esa palabra clave solo se interpreta cuando el PR apunta a la rama default del repositorio — al fusionarlo contra `main`, GitHub cierra el issue automáticamente y actualiza su estado en el Project sin acción manual.

```bash
gh pr create --title "<type>(<scope>): <description>" --body "<context to preserve in main>. Closes #<número>"
```

Si el repositorio tiene CI configurado con el trigger `on: pull_request`, se dispara automáticamente al crear el PR.

#### Fusionar (merge)

```bash
gh pr merge --auto --squash
```

- `--squash` colapsa todos los commits de la rama en uno solo.
- `--auto` fusiona en cuanto el CI pase y las reglas de protección de rama (si existen) se cumplan, sin tener que esperar ni volver después.
- Si el CI falla, el auto-merge simplemente no se dispara — hay que corregir y hacer push de nuevo sobre la misma rama.
- Si `main` avanza mientras el PR sigue abierto y el repositorio exige que la rama esté actualizada, el auto-merge se queda esperando. Actualizar manualmente:

```bash
git fetch origin
git merge origin/main
git push
```

  o usar el botón **"Update branch"** en GitHub. El CI se vuelve a correr y el auto-merge retoma su curso.

### Flujo de trabajo completo

Secuencia de punta a punta para cualquier cambio, de uno trivial a un módulo entero. Asume Git y GitHub CLI (`gh`) instalados; si el equipo no usa `gh`, los mismos pasos aplican creando y fusionando el PR desde la interfaz web de GitHub. También asume que, si el repositorio exige squash merge y/o protección sobre `main`, esa configuración ya existe — de lo contrario, algunos pasos (como `--auto`) no aplican tal cual.

1. **Crear el issue** (obligatorio para `feat`/`fix`; opcional para el resto — ver [Issues](#issues))
   ```bash
   gh issue create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving."
   ```
2. **Crear la rama**
   ```bash
   gh issue develop <número-de-issue> --name feature/example --checkout
   ```
   Sin issue, se crea de la forma tradicional:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b chore/example
   ```
3. **Hacer commits siguiendo la convención**
   ```bash
   git add .
   git commit -m "feat(scope): short description of the change"
   ```
4. **Subir la rama**
   ```bash
   git push -u origin feature/example
   ```
   Solo se necesita `-u` la primera vez; después basta `git push`.
5. **Abrir el PR**
   ```bash
   gh pr create --title "feat(scope): short description of the change" --body "Explain the why and any context worth preserving in main. Closes #<número>"
   ```
6. **Fusionar**
   ```bash
   gh pr merge --auto --squash
   ```
   Si el repositorio tiene habilitada la opción de borrar ramas automáticamente al fusionar, la rama remota desaparece sola.
7. **Actualizar `main` local**
   ```bash
   git checkout main
   git pull origin main
   ```
   Trae a la copia local el commit de squash merge recién creado en `main`.

8. **Limpieza local (opcional)**
   ```bash
   git branch -D feature/example
   ```
   El remoto ya se encargó de la suya si esa opción está habilitada; esto solo limpia la copia local.