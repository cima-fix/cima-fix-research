# Ajustes del repositorio

Plantilla de referencia para configurar y documentar los ajustes de GitHub de un repositorio: qué hace cada ajuste y por qué se recomienda.

---

## GitHub Actions — `.github/workflows/<archivo>.yml`

| Ajuste                                                            | Efecto                                                                                                                                    | Por qué                                                                                                                                                                                                                      |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on: pull_request`                                                | El CI corre cada vez que se abre o actualiza un PR, antes de poder mergear.                                                               | Es la verificación previa al merge. Si el ruleset de `main` ya exige "Require a pull request before merging" (más abajo), no hace falta correr el CI también sobre push directo: ese caso ya queda bloqueado por el ruleset. |
| `<archivo de versión fijada>` (ej. `node-version-file: '.nvmrc'`) | El CI instala la misma versión de runtime que se usa localmente, leyendo el archivo fijado en vez de hardcodear el número en el workflow. | Una sola fuente de verdad para la versión — si cambia, se edita en un solo lugar.                                                                                                                                            |
| Paso(s) de verificación (lint / typecheck / tests)                | Corre los scripts que el proyecto ya define para esto.                                                                                    | Atrapa errores antes de mergear, sin depender de que alguien se acuerde de correrlos a mano.                                                                                                                                 |
| Paso(s) contra un servicio externo — *opcional*                   | Deja el entorno de prueba en el estado que las pruebas asumen antes de correrlas (ej. migraciones sobre una base de datos de prueba).     | Solo aplica si las pruebas dependen de un servicio real; si son autocontenidas, se omite esta fila por completo.                                                                                                             |

Si estos pasos corren **como steps secuenciales dentro de un mismo job**, basta con marcar ese job como check requerido en el ruleset (más abajo): si cualquier step falla, el job entero falla y bloquea el merge igual. Si en cambio corren como **jobs separados**, cada uno debe marcarse como requerido por separado.

**Secrets** (Settings → Secrets and variables → Actions) — *opcional*: cualquier credencial que el workflow necesite para comunicarse con un servicio externo durante CI vive ahí, nunca en un archivo `.env` dentro del repo ni expuesta en el runner.

---

## Ruleset sobre `main`

Configurado en Settings → Rules → Rulesets.

| Ajuste                                           | Valor                                                                       | Efecto                                                                                                                                                                  | Por qué                                                                                                                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Require a pull request before merging            | Activado                                                                    | GitHub rechaza cualquier `git push` directo a `main`; todo cambio entra vía un PR mergeado.                                                                             | Es el control base: sin esto, el CI y todo lo demás se pueden saltar con un push directo.                                                                                           |
| Required approvals                               | `<0 en un repositorio individual — nadie más puede revisar / ≥1 en equipo>` | Con 0, el botón de merge no depende de que alguien más lo apruebe. Con ≥1, el PR queda bloqueado hasta recibir esa aprobación, además de pasar el CI.                   | En un repositorio individual, exigir 1+ deja el PR bloqueado sin nadie que lo apruebe. En equipo, agrega una revisión humana antes de mergear — complementa al CI, no lo sustituye. |
| Require status checks to pass → check `<nombre>` | Activado                                                                    | El botón de merge queda deshabilitado mientras ese check no termine en verde.                                                                                           | Sin esto, el CI corre pero es solo informativo — se podría mergear con el CI en rojo igual.                                                                                         |
| Require branches to be up to date before merging | Activado                                                                    | Si `main` avanzó después de crear la rama de trabajo, obliga a actualizarla antes de mergear, y el CI se vuelve a correr sobre esa versión.                             | Evita mergear una rama cuyo CI pasó contra una versión vieja de `main` que ya no aplica.                                                                                            |
| Allowed merge methods                            | Solo Squash merge                                                           | Garantiza que `gh pr merge --squash` sea la única vía posible — sin este ajuste, squash seguiría funcionando, pero merge commit o rebase también quedarían disponibles. | Historial limpio (un commit por PR).                                                                                                                                                |
| Restrict who can bypass                          | Lista vacía                                                                 | Nadie, incluido el dueño del repo, puede saltarse las reglas anteriores.                                                                                                | Dejar la lista vacía es lo que hace que el ruleset realmente aplique, en vez de quedar configurado pero sin efecto.                                                                 |

---

## Configuración general del repo — Settings → General

| Ajuste                                    | Efecto                                                                                                                                                  | Por qué                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Automatically delete head branches        | Al mergear un PR, la rama remota se borra sola.                                                                                                         | Evita acumulación de ramas viejas sin tener que borrarlas a mano cada vez.                                             |
| Allow auto-merge                          | Habilita la opción de auto-merge en los PRs (usada por `gh pr merge --auto`).                                                                           | Permite marcar un PR para que se mergee solo en cuanto se cumplan las condiciones, sin volver a revisarlo manualmente. |
| Default commit message for squash merging | "Pull request title and description" — el commit final usa el título del PR y su descripción como body, no la lista de commits individuales de la rama. | Conserva el contexto del PR directamente en el historial, sin depender de ir a GitHub a buscarlo.                      |

---

## Resultado neto del conjunto

`main` solo avanza mediante PR → CI en verde (si aplica) → aprobación (si el equipo la exige) → squash merge. Ningún estado sin verificar llega a `main`, y el costo de cumplir el flujo se reduce a un puñado de comandos de Git y de GitHub CLI.