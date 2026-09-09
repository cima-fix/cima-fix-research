# Cima Fix Research

Cima Fix Research es una suite de 6 interfaces web, cada una representando un método de investigación para convertir el ruido cualitativo de entrevistas y observaciones en datos estructurados, capturados, persistidos y exportables. Es un proyecto distinto de la app Cima Fix — comparte equipo y parte del stack, pero no código, base de datos ni infraestructura.

---

## El problema

La investigación de usuarios real —entrevistas, observación de campo, notas sueltas— suele quedar dispersa en post-its, cuadernos o grabaciones sin estructura, difícil de comparar, buscar o convertir en requisitos rastreables. Sin una herramienta dedicada, ese material cualitativo rara vez llega convertido en insights accionables al momento de diseñar.

Cima Fix Research resuelve esto con una interfaz de captura dedicada a cada método:

### Entrevista a Expertos
Registra el perfil de la persona experta entrevistada, un guion dinámico de preguntas y respuestas con marca de citas textuales clave, y un mapa de complejidad técnica: conceptos, jerga del dominio, dependencias entre componentes y actores del ecosistema, además de riesgos técnicos y referencias.

### Usuarios Extremos
Clasifica a cada usuario observado (súper-experto, inexperto, mainstream) y documenta sus workarounds, las fricciones que amplifica y la necesidad extrema detectada — junto con la hipótesis de cómo esa necesidad se generaliza al usuario promedio.

### Needfinding — El Iceberg
Separa, por cada observación, lo que el usuario dice que quiere (necesidades obvias, en la superficie) de lo que realmente necesita pero no verbaliza (necesidades ocultas, en profundidad), distinguiendo explícitamente el dato crudo observado de la interpretación.

### Empathy Map — The Parser
Convierte fragmentos sueltos de una entrevista en los cuatro cuadrantes clásicos — Dice, Hace, Piensa, Siente — y genera insights estructurados con tipo y prioridad, visualizados en una cuadrícula 2×2.

### Roper Dynagram
Segmenta a los usuarios entrevistados por valores y estilos de vida (Adventurers, Open Minded, Realists, Organics), visualiza la proporción real observada en una rueda que se recalcula automáticamente al agregar o editar usuarios, y al seleccionar un segmento muestra el requisito UX, la funcionalidad clave y el tono del sistema derivados de él.

### Mapeo de Requerimientos
Traza cada insight o segmento hasta un requisito funcional o de UX, con su prioridad y estado de validación — con una "ley embebida" que recalcula prioridades cuando cambia un parámetro, y una vista de trazabilidad completa: insight → requisito → decisión de arquitectura.

---

## 📄 Documentación técnica

| Documento                                                                                                          | Contenido                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [`investigacion_de_usuarios.md`](./docs/investigacion_de_usuarios.md)                                              | Especificación del trabajo — qué campos debe capturar cada interfaz, método por método.                            |
| [`blueprint.md`](./docs/blueprint.md)                                                                              | Blueprint técnico — stack, estructura del repositorio, convenciones de código y componentes compartidos.           |
| [`CONTRIBUTING.md`](./docs/CONTRIBUTING.md)                                                                        | Guía de contribución — Desarrollo local del proyecto y flujos de commits, ramas y pull requests.                   |
| [`repository-config.md`](./docs/repository-config.md)                                                              | Plantilla de referencia de ajustes de GitHub — Actions, ruleset de `main` y configuración general del repositorio. |
| [Figma](<https://www.figma.com/design/htKcqDpxkgfinmSvzsKGB5/Cima-Fix-Research?node-id=15-3&t=7OAWRTTWSIbYcG7N-1>) | Wireframes de las 6 interfaces. Fuente de verdad de los tokens de diseño.                                          |

---

## 🛠️ Stack técnico

- **Frontend:** React + Vite + TypeScript, con Tailwind CSS v4 (`@tailwindcss/vite`)
- **Ruteo:** React Router
- **Persistencia:** `localStorage` por defecto, con `idb-keyval` (IndexedDB) como respaldo si alguna interfaz necesita guardar más datos
- **Exportación JSON/CSV:** utilidades propias (`lib/export.ts`), sin librería externa
- **Visualización:** CSS Grid para la cuadrícula del Empathy Map; Recharts v3 para la rueda del Roper Dynagram
- **Backend / base de datos / autenticación:** ninguno — no hay cuentas ni sincronización de datos entre distintas personas o dispositivos; cada quien captura y consulta la información desde su propio navegador
- **Lint / formato:** ESLint + Prettier

---

## Equipo de desarrollo

| Nombre                                                           |
| ---------------------------------------------------------------- |
| [Alcantar Martinez, Emir Alexander](https://github.com/ALXND3R)  |
| [Zazueta Medrano, Aidan](https://github.com/AidanZZMD)           |
| [Montano Valencia, Mike Armando](https://github.com/MikeArmando) |
| [Moreno Calderon, Troy Leonardo](https://github.com/Troy2404)    |
| [Perez Aguirre Mextli, Citlali](https://github.com/mxcitali)     |
| [Jaime Mascareño, Carlos Alberto](https://github.com/TitaniumCJ) |
| [Meza Espinoza, Kevin Andre](https://github.com/kmeza1402)       |

---

<sub>Proyecto desarrollado por el equipo de Cima Fix como parte de un curso en la Universidad Autónoma de Baja California (UABC). Suite de instrumentos de investigación de usuarios, complementaria a la app Cima Fix.</sub>