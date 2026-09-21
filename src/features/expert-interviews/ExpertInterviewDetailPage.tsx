// features/expert-interviews/ExpertInterviewDetailPage.tsx
// Read-only detail view of an interview.
// Base layout based on the Figma wireframe: Profile + References in the left
// column; Dynamic script (Question + Answer) / Restrictions and risks / Technical complexity map
// Notes and next steps in a 2x2 grid on the right.

import { Link, useParams } from "react-router";
import { Badge } from "../../components/ui/Badge.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { createStorageKey, getItem } from "../../lib/storage.ts";
import type { ExpertInterview } from "./types.ts";

const STORAGE_KEY = createStorageKey("expert-interviews", "interviews");

export function ExpertInterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const interviews = getItem<ExpertInterview[]>(STORAGE_KEY, []);
  const interview = interviews.find((item) => item.id === id);

  if (!interview) {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-body-sm text-ink-primary">
          No se encontró la entrevista solicitada.
        </p>
        <Link to="/expert-interviews" className="text-primary underline w-fit">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const {
    perfil,
    guion,
    complejidadTecnica,
    restriccionesYRiesgos,
    referencias,
    notas,
    siguientesPasos,
  } = interview;

  return (
    <div className="w-full flex flex-col gap-4">
      <Link to="/expert-interviews" className="text-primary underline w-fit text-body-sm">
        ← Volver a la lista
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
        {/* Left column: Profile + References */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-2">
            <h1 className="text-heading-5 font-medium text-ink-primary">{perfil.alias}</h1>
            <Badge variant={perfil.medio === "presencial" ? "success" : "neutral"}>
              {perfil.medio}
            </Badge>
            <dl className="flex flex-col gap-2 mt-2">
              <div>
                <dt className="text-body-xs text-ink-secondary">Rol</dt>
                <dd className="text-body-sm text-ink-primary">{perfil.rol}</dd>
              </div>
              <div>
                <dt className="text-body-xs text-ink-secondary">Dominio</dt>
                <dd className="text-body-sm text-ink-primary">{perfil.dominio}</dd>
              </div>
              <div>
                <dt className="text-body-xs text-ink-secondary">Organización</dt>
                <dd className="text-body-sm text-ink-primary">{perfil.organizacion}</dd>
              </div>
              <div>
                <dt className="text-body-xs text-ink-secondary">Años de experiencia</dt>
                <dd className="text-body-sm text-ink-primary">{perfil.aniosExperiencia}</dd>
              </div>
              <div>
                <dt className="text-body-xs text-ink-secondary">Fecha</dt>
                <dd className="text-body-sm text-ink-primary">{perfil.fecha || "—"}</dd>
              </div>
            </dl>
          </Card>

          {/* Recommended references/sources */}
          <Card className="flex flex-col gap-3">
            <h2 className="text-body-sm font-medium text-ink-primary">
              Referencias / fuentes recomendadas
            </h2>
            {referencias.length === 0 ? (
              <p className="text-body-xs text-ink-secondary">Ninguna registrada.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {referencias.map((ref) => (
                  <li key={ref.id} className="flex flex-col">
                    <span className="text-body-sm text-ink-primary">{ref.descripcion}</span>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-body-xs text-primary underline w-fit"
                      >
                        {ref.url}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dynamic script */}
          <Card className="flex flex-col gap-3">
            <h2 className="text-body-sm font-medium text-ink-primary">Guion dinámico</h2>
            {guion.length === 0 && (
              <p className="text-body-xs text-ink-secondary">Sin preguntas registradas.</p>
            )}
            {guion.map((qa) => (
              <div key={qa.id} className="flex flex-col gap-1 border-b border-border pb-2 last:border-0">
                <p className="text-body-sm font-medium text-ink-primary">{qa.pregunta}</p>
                <p className="text-body-sm text-ink-secondary">{qa.respuesta}</p>
                {qa.esCitaTextualClave && <Badge variant="warning">Cita textual clave</Badge>}
              </div>
            ))}
          </Card>

          {/* Restrictions and risks */}
          <Card className="flex flex-col gap-3">
            <h2 className="text-body-sm font-medium text-ink-primary">
              Restricciones y riesgos
            </h2>
            {restriccionesYRiesgos.length === 0 ? (
              <p className="text-body-xs text-ink-secondary">Ninguna registrada.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {restriccionesYRiesgos.map((item, index) => (
                  <Badge key={`${item}-${index}`} variant="danger">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Technical complexity map */}
          <Card className="flex flex-col gap-3">
            <h2 className="text-body-sm font-medium text-ink-primary">
              Mapa de complejidad técnica
            </h2>
            <ComplejidadGroup label="Conceptos clave" items={complejidadTecnica.conceptosClave} />
            <ComplejidadGroup label="Jerga del dominio" items={complejidadTecnica.jergaDelDominio} />
            <ComplejidadGroup
              label="Dependencias entre componentes"
              items={complejidadTecnica.dependenciasEntreComponentes}
            />
            <ComplejidadGroup
              label="Actores del ecosistema"
              items={complejidadTecnica.actoresDelEcosistema}
            />
          </Card>

          {/*Notes and next steps */}
          <Card className="flex flex-col gap-3">
            <h2 className="text-body-sm font-medium text-ink-primary">
              Notas y siguientes pasos
            </h2>
            <div>
              <p className="text-body-xs text-ink-secondary">Notas</p>
              <p className="text-body-sm text-ink-primary whitespace-pre-wrap">
                {notas || "—"}
              </p>
            </div>
            <div>
              <p className="text-body-xs text-ink-secondary">Siguientes pasos</p>
              <p className="text-body-sm text-ink-primary whitespace-pre-wrap">
                {siguientesPasos || "—"}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ComplejidadGroup({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-body-xs text-ink-secondary">{label}</p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="neutral">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}