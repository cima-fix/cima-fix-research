import type { ComponentType, SVGProps } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button.tsx";
import { Card } from "../components/ui/Card.tsx";
import { ImportButton } from "../components/ui/ImportButton.tsx";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function ExpertInterviewsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 20l.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
      <path d="M8 10h8M8 13.5h5" />
    </svg>
  );
}

function ExtremeUsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12h18" />
      <circle cx="4.5" cy="12" r="2.25" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19.5" cy="12" r="2.25" />
    </svg>
  );
}

function NeedfindingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2 9 9h6z" />
      <path d="M5 9 2 20h20L19 9z" />
      <path d="M1 9h22" />
    </svg>
  );
}

function EmpathyMapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function RoperDynagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V3M12 12l7.79 4.5" />
    </svg>
  );
}

function RequirementsMappingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 6.8 17 11M7 17.2 17 13" />
    </svg>
  );
}

interface ResearchMethod {
  name: string;
  description: string;
  path: string;
  icon: IconComponent;
}

const RESEARCH_METHODS: ResearchMethod[] = [
  {
    name: "Entrevista a Expertos",
    description:
      "Perfil del experto, guion de preguntas y respuestas, y mapa de complejidad técnica del dominio.",
    path: "/expert-interviews",
    icon: ExpertInterviewsIcon,
  },
  {
    name: "Usuarios Extremos",
    description:
      "Clasificación de usuarios, workarounds detectados y la hipótesis de generalización al usuario promedio.",
    path: "/extreme-users",
    icon: ExtremeUsersIcon,
  },
  {
    name: "Needfinding (El Iceberg)",
    description:
      "Necesidades obvias en la superficie y necesidades ocultas en profundidad, separadas del dato crudo.",
    path: "/needfinding",
    icon: NeedfindingIcon,
  },
  {
    name: "Empathy Map (The Parser)",
    description:
      "Fragmentos de entrevista distribuidos en Dice / Hace / Piensa / Siente, con insights estructurados.",
    path: "/empathy-map",
    icon: EmpathyMapIcon,
  },
  {
    name: "Roper Dynagram",
    description:
      "Segmentación de usuarios por valores y estilos de vida, con proporciones recalculadas automáticamente.",
    path: "/roper-dynagram",
    icon: RoperDynagramIcon,
  },
  {
    name: "Mapeo de Requerimientos",
    description:
      "Vincula insights y segmentos con requisitos, prioridad y trazabilidad hasta la decisión de arquitectura.",
    path: "/requirements-mapping",
    icon: RequirementsMappingIcon,
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-2 font-semibold text-ink-primary">
          Cima Fix Research
        </h1>
        <p className="max-w-2xl text-body-sm text-ink-secondary">
          Suite de 6 interfaces para convertir el ruido cualitativo de
          entrevistas y observaciones en datos estructurados, capturados,
          persistidos y exportables.
        </p>
      </header>

      <section
        aria-labelledby="import-dataset-heading"
        className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:py-4"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="import-dataset-heading"
            className="text-heading-6 font-semibold text-ink-primary"
          >
            Importar dataset real
          </h2>
          <p className="max-w-2xl text-body-sm text-ink-secondary">
            Sube aquí el archivo JSON con la misma forma que el dataset
            consolidado para poblar las 6 interfaces sin recargar registro
            por registro.
          </p>
          <p className="max-w-2xl text-body-sm text-danger">
            Sobrescribe los datos ya guardados de las interfaces incluidas
            en el archivo — no se puede deshacer.
          </p>
        </div>
        <ImportButton className="sm:w-auto sm:flex-shrink-0" />
      </section>

      <section
        aria-label="Métodos de investigación"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {RESEARCH_METHODS.map((method) => (
          <Card key={method.path} className="flex flex-col gap-4">
            <div className="flex h-24 items-center justify-center rounded-md bg-secondary">
              <method.icon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-6 font-semibold text-ink-primary">
                {method.name}
              </h2>
              <p className="text-body-sm text-ink-secondary">
                {method.description}
              </p>
            </div>
            <Button
              variant="secondary"
              className="mt-auto"
              onClick={() => navigate(method.path)}
            >
              Abrir interfaz
            </Button>
          </Card>
        ))}
      </section>
    </div>
  );
}