# Tarea: Instrumentos digitales para la investigación de usuarios

Convertir el "ruido cualitativo" de las entrevistas en datos estructurados, con el mismo rigor con que documentamos código.

- **Carrera:** Ingeniería en Software y Tecnologías Emergentes
- **Unidad:** Ingeniería Centrada en el Humano — Investigación de usuarios
- **Modalidad:** Individual o en parejas
- **Tipo:** Proyecto de programación + trabajo de campo

## Objetivo

Programar una **suite de interfaces web** con **una interfaz por cada método de investigación de usuarios** visto en clase. No son maquetas: deben ser **herramientas funcionales de captura de datos** que cada estudiante usará para **registrar la información de sus propias entrevistas y descubrimientos** al investigar usuarios reales.

El sistema debe transformar el material cualitativo de una entrevista en **datos estructurados, almacenados y exportables**.

## Métodos vistos en las diapositivas

- **Entrevistas a expertos** — mapear la complejidad técnica y el ecosistema del problema.
- **Observación de usuarios extremos** — súper-expertos e inexpertos frente al usuario *mainstream*.
- **Observación directa / Needfinding** — "El Iceberg de las Necesidades": necesidades obvias vs. ocultas.
- **Empathy Map** — "The Parser": Say / Do / Think / Feel → Insights estructurados.
- **Roper Dynagram** — segmentación por valores y estilos de vida → requerimientos de producto.
- **Dynagram de mapeo de requerimientos** — trazabilidad insight → requisito → decisión de arquitectura.

## Trabajo de campo (obligatorio)

Antes o durante el desarrollo, cada estudiante (o pareja) debe:

- Entrevistar / observar **mínimo 4 usuarios reales** en torno a un problema de su elección.
- Incluir al menos **1 usuario extremo** y **1 experto del dominio**.
- Cargar **datos reales** (no ficticios) en cada interfaz. La suite se entrega **con el dataset lleno**.

## Interfaces a desarrollar

Cada interfaz debe permitir: crear / editar / eliminar registros (listas dinámicas), validación de campos, persistencia (localStorage, IndexedDB o backend ligero) y **exportación a JSON y CSV**.

### 1. Interfaz — Entrevista a Expertos

Campos mínimos a capturar:

- Perfil del experto: alias, rol, dominio, años de experiencia, organización, fecha, medio (presencial/remoto).
- Guion dinámico: lista de pares *pregunta → respuesta*, con marca de "cita textual clave".
- Mapa de complejidad técnica: conceptos clave, jerga del dominio, dependencias entre componentes, actores del ecosistema.
- Restricciones y riesgos técnicos señalados por el experto.
- Referencias / fuentes recomendadas.
- Notas y siguientes pasos.

### 2. Interfaz — Usuarios Extremos (Extreme Users)

Campos mínimos:

- Clasificación del usuario: súper-experto / inexperto / mainstream.
- Perfil: alias, contexto y frecuencia de uso, nivel de habilidad (escala 1–10).
- Tareas observadas.
- **Workarounds / adaptaciones manuales** detectadas.
- Errores o fricciones que este usuario **amplifica**.
- Necesidad extrema detectada + hipótesis de cómo se generaliza al usuario promedio.
- Evidencia: enlaces, fotos, marcas de tiempo.

### 3. Interfaz — Observación Directa / Needfinding ("El Iceberg")

Campos mínimos:

- Contexto de observación: lugar, fecha, duración, actividad observada.
- **Registro en dos capas del iceberg:**
  - *Necesidades obvias (superficie):* lo que el usuario dice que quiere, *feature requests*.
  - *Necesidades ocultas (profundidad):* frustraciones silenciadas, emociones subyacentes, lo que realmente necesita.
- Separación explícita entre **dato crudo observado** (comportamiento) e **interpretación/inferencia**.
- Etiqueta de potencial de innovación: bajo / alto.

### 4. Interfaz — Empathy Map ("The Parser")

Campos mínimos:

- Sujeto del mapa (usuario o segmento).
- Bandeja de entrada de "ruido cualitativo sin procesar" (frases sueltas, observaciones).
- Cuatro cuadrantes a los que se asigna cada fragmento: **Dice** (citas textuales), **Hace** (comportamientos observados), **Piensa** (modelos mentales inferidos), **Siente** (respuesta emocional + intensidad).
- Generador de **Insights estructurados**: tipo (problema de usabilidad / necesidad oculta / carga cognitiva / adaptación manual / innovación potencial), descripción y prioridad.
- Visualización de la cuadrícula 2×2 y exportación de los insights.

### 5. Interfaz — Roper Dynagram (segmentación por valores)

Campos mínimos:

- Definición de segmentos: nombre, valores asociados, % observado en la muestra propia (ej.: *Adventurers* → estatus/poder/ambición; *Open Minded* → curiosidad/individualidad/creatividad; *Realists* → seguridad/pragmatismo; *Organics* → naturaleza/belleza/arraigo).
- Asignación de cada usuario entrevistado a uno o más segmentos, con evidencia.
- **Visualización tipo rueda / gráfico polar** donde el tamaño de cada sección corresponde a la cuota real observada (se **recalcula automáticamente** al añadir o editar usuarios).
- Panel dinámico de salida: al seleccionar un segmento, mostrar requisito UX derivado, funcionalidad clave y tono del sistema.

### 6. Interfaz — Mapeo de Requerimientos (Dynagram interactivo) OBLIGATORIA

Campos y comportamiento mínimos:

- Vincula cada insight / segmento con: requisito funcional, requisito UX / no funcional, prioridad y estado de validación con el usuario.
- **"Ley embebida":** al cambiar un parámetro (p. ej. el tamaño de un segmento) se **recalculan las prioridades** del resto.
- Vista de **trazabilidad**: insight → requisito → decisión de arquitectura.

## Requisitos técnicos

- Framework libre (React, Vue, Svelte, Angular o JS/HTML/CSS vanilla), pero **consistente** en toda la suite.
- Navegación unificada: un menú desde el que se acceda a las **6 interfaces**.
- Al menos **dos visualizaciones de datos** reales (cuadrícula del Empathy Map + rueda del Roper Dynagram como mínimo).
- Persistencia local o remota + exportación **JSON y CSV**.
- Diseño responsivo y accesible (etiquetas, contraste, navegación por teclado).
- Repositorio Git con historial de commits y `README` de instalación / uso.

## Entregables

- Repositorio con el código de la suite.
- Suite desplegada o ejecutable localmente, **con los datos reales de las entrevistas cargados**.
- Export (JSON/CSV) del dataset de cada interfaz.
- Documento breve (1–2 páginas): problema investigado, a quién se entrevistó, **qué necesidades ocultas se descubrieron** y **cómo cambió la definición del problema** tras la investigación.
- **Exposición oral de 10 a 20 minutos** ante el grupo (ver detalle abajo).

**Exposición (10–20 min).** Cada estudiante o pareja presenta ante el grupo: el problema investigado y a quién se entrevistó; una **demostración en vivo** de la carga de un caso real en cada una de las 6 interfaces; los **hallazgos de necesidades ocultas**; y cómo evolucionó la definición del problema. Se reserva tiempo para preguntas del docente y del grupo.

## Rúbrica de evaluación (100 puntos)

| Criterio | Pts |
|---|---|
| Fidelidad al método: cada una de las 6 interfaces captura lo que su método exige | 20 |
| Funcionalidad de captura: CRUD, validación, listas dinámicas | 15 |
| Persistencia + exportación JSON/CSV en todas las interfaces | 8 |
| Visualizaciones: cuadrícula del Empathy Map + rueda del Roper Dynagram con recálculo automático | 12 |
| Interfaz de Mapeo de Requerimientos: vínculos, "ley embebida" con recálculo de prioridades y vista de trazabilidad | 12 |
| Datos reales cargados de ≥4 usuarios (incluye 1 extremo y 1 experto) | 13 |
| Calidad de código, repositorio y README | 5 |
| Documento de reflexión (necesidades ocultas y evolución del problema) | 5 |
| Exposición oral (10–20 min) con demostración en vivo de las 6 interfaces | 10 |
| **Total** | **100** |

Tecnologías Emergentes para el Desarrollo de Soluciones — Investigación de usuarios (1.1.1). Documento de tarea para estudiantes.
