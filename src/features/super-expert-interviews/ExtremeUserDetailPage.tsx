// src/features/super-expert-interviews/ExtremeUserDetailPage.tsx
// Read-only detail view of an extreme user, following the Figma card-grid layout:
// top-left = profile, top-right = observed tasks, middle row = workarounds /
// frictions / extreme need + hypothesis, bottom = evidence (full width).

import { Link, useParams } from "react-router";
import { Badge } from "../../components/ui/Badge.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { createStorageKey, getItem } from "../../lib/storage.ts";
import {
  CLASSIFICATION_LABELS,
  type ExtremeUser,
  type UserClassification,
} from "./types.ts";

const STORAGE_KEY = createStorageKey("extreme-users", "users");

// Same mapping ExtremeUsersPage uses for the list's classification badge
function classificationBadgeVariant(
  classification: UserClassification,
): "success" | "warning" | "neutral" {
  switch (classification) {
    case "super-experto":
      return "success";
    case "inexperto":
      return "warning";
    case "mainstream":
      return "neutral";
  }
}

function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function ExtremeUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const users = getItem<ExtremeUser[]>(STORAGE_KEY, []);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="text-body-sm text-ink-primary">
          No se encontró el usuario extremo solicitado.
        </p>
        <Link to="/extreme-users" className="text-primary underline w-fit">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const {
    alias,
    classification,
    usageContext,
    usageFrequency,
    skillLevel,
    observedTasks,
    workarounds,
    amplifiedFrictions,
    extremeNeed,
    generalizationHypothesis,
    evidence,
  } = user;

  return (
    <div className="w-full flex flex-col gap-2.5 lg:gap-16">
      <Link to="/extreme-users" className="text-primary underline w-fit text-body-sm">
        ← Volver a la lista
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Top-left: profile */}
        <Card className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-body-sm font-medium text-ink-secondary"
            >
              {alias.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-heading-5 font-medium text-ink-primary">{alias}</h1>
              <Badge variant={classificationBadgeVariant(classification)}>
                {CLASSIFICATION_LABELS[classification]}
              </Badge>
            </div>
          </div>
          <dl className="flex flex-col gap-2">
            <div>
              <dt className="text-body-xs text-ink-secondary">Usage context</dt>
              <dd className="text-body-sm text-ink-primary">{usageContext || "—"}</dd>
            </div>
            <div>
              <dt className="text-body-xs text-ink-secondary">Usage frequency</dt>
              <dd className="text-body-sm text-ink-primary">{usageFrequency || "—"}</dd>
            </div>
            <div>
              <dt className="text-body-xs text-ink-secondary">Skill level (1-10)</dt>
              <dd className="text-body-sm text-ink-primary">{skillLevel}</dd>
            </div>
          </dl>
        </Card>

        {/* Top-right: observed tasks */}
        <Card className="flex flex-col gap-2.5">
          <h2 className="text-body-sm font-medium text-ink-primary">Observed tasks</h2>
          <TagGroup items={observedTasks} emptyLabel="No tasks recorded." variant="neutral" />
        </Card>
      </div>

      {/* Middle row: workarounds / frictions / extreme need + hypothesis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-2.5">
          <h2 className="text-body-sm font-medium text-ink-primary">
            Workarounds / manual adaptations
          </h2>
          <TagGroup items={workarounds} emptyLabel="None recorded." variant="neutral" />
        </Card>

        <Card className="flex flex-col gap-2.5">
          <h2 className="text-body-sm font-medium text-ink-primary">
            Frictions this user amplifies
          </h2>
          <TagGroup items={amplifiedFrictions} emptyLabel="None recorded." variant="danger" />
        </Card>

        <Card className="flex flex-col gap-2.5">
          <h2 className="text-body-sm font-medium text-ink-primary">
            Extreme need + generalization hypothesis
          </h2>
          <div>
            <p className="text-body-xs text-ink-secondary">Extreme need</p>
            <p className="text-body-sm text-ink-primary whitespace-pre-wrap">
              {extremeNeed || "—"}
            </p>
          </div>
          <div>
            <p className="text-body-xs text-ink-secondary">Generalization hypothesis</p>
            <p className="text-body-sm text-ink-primary whitespace-pre-wrap">
              {generalizationHypothesis || "—"}
            </p>
          </div>
        </Card>
      </div>

      {/* Bottom: evidence, full width */}
      <Card className="flex flex-col gap-2.5">
        <h2 className="text-body-sm font-medium text-ink-primary">Evidence</h2>
        {evidence.length === 0 ? (
          <p className="text-body-xs text-ink-secondary">No evidence recorded.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {evidence.map((item, index) => (
              <li key={`${item}-${index}`} className="text-body-sm text-ink-primary">
                {isLikelyUrl(item) ? (
                  <a
                    href={item}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    {item}
                  </a>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function TagGroup({
  items,
  emptyLabel,
  variant,
}: {
  items: string[];
  emptyLabel: string;
  variant: "neutral" | "danger";
}) {
  if (items.length === 0) {
    return <p className="text-body-xs text-ink-secondary">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <Badge key={`${item}-${index}`} variant={variant}>
          {item}
        </Badge>
      ))}
    </div>
  );
}
