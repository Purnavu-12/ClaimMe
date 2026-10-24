"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { clauses } from "@/domain/fixtures";
import { Badge, ButtonLink, Field, PageHeading, SourceLink } from "./ui";
export function PolicyView({ detail = false }: { detail?: boolean }) {
  const params = useSearchParams();
  const [selected, setSelected] = useState(params.get("clause") ?? "copay");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const clause = clauses.find((c) => c.id === selected) ?? clauses[0];
  if (!detail)
    return (
      <>
        <PageHeading
          eyebrow="Understand the wording"
          title="Your policies"
          description="Start with the contract. Keep interpretations and missing evidence separate."
        />
        <Link className="policy-card" href="/app/policies/EH-2026">
          <ShieldCheck size={34} weight="light" />
          <div>
            <p className="eyebrow">Example Health Insurance</p>
            <h2>Health Companion · EH-2026</h2>
            <p>01 October 2026 — 30 September 2027</p>
            <Badge tone="warning">Continuity needs verification</Badge>
          </div>
          <ArrowRight size={24} />
        </Link>
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="EH-2026 · Synthetic policy"
        title="The wording. In context."
        description="Original clauses and authored explanations, side by side. This is not a coverage decision."
      />
      <div className="policy-periods">
        <div>
          <span className="fine">PREVIOUS PERIOD</span>
          <strong>29 Sep 2025 — 28 Sep 2026</strong>
        </div>
        <div className="period-gap">
          <Badge tone="warning">Dates need verification</Badge>
          <span>Payment record missing</span>
        </div>
        <div>
          <span className="fine">CURRENT PERIOD</span>
          <strong>01 Oct 2026 — 30 Sep 2027</strong>
          <span className="fine">Hospitalization: 09–13 Oct 2026</span>
        </div>
      </div>
      <div className="tabs" role="group" aria-label="Policy clauses">
        {clauses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            aria-pressed={c.id === clause.id}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div className="split policy-detail">
        <section className="document-sheet">
          <p className="eyebrow">Original policy wording</p>
          <h2>{clause.title}</h2>
          <blockquote>{clause.wording}</blockquote>
          <SourceLink source={clause.source} />
          <p className="fine">
            Synthetic policy text. Production explanations must use the
            applicable uploaded contract and version.
          </p>
        </section>
        <section className="tinted" aria-live="polite">
          <Badge tone={clause.id === "continuity" ? "warning" : "neutral"}>
            {clause.id === "continuity"
              ? "Needs verification"
              : "Authored interpretation"}
          </Badge>
          <h2>What this means</h2>
          <p>{clause.explanation}</p>
          <h3>Potential effect / next question</h3>
          <p>{clause.effect}</p>
          <ButtonLink secondary href="/app/claims/CM-1024">
            View related claim
          </ButtonLink>
        </section>
      </div>
      <section className="workspace-section">
        <p className="eyebrow section-label">Policy Ask · authored demo</p>
        <h2>Ask a question. Follow the source.</h2>
        <p>
          Try “How is co-pay calculated?” or “Is my renewal continuous?” No AI
          service is connected.
        </p>
        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            const q = question.toLowerCase();
            setAnswer(
              q.includes("co-pay") || q.includes("copay")
                ? "copay"
                : q.includes("renew") || q.includes("continuity")
                  ? "continuity"
                  : q.includes("limit")
                    ? "sublimit"
                    : "unknown",
            );
          }}
        >
          <Field label="Your policy question">
            <input
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={400}
              placeholder="How is co-pay calculated?"
            />
          </Field>
          <button className="button" type="submit">
            Find an explanation
            <ArrowRight size={16} />
          </button>
        </form>
        {answer && (
          <div className="answer tinted" role="status">
            {answer === "unknown" ? (
              <>
                <h3>There isn’t a grounded demo answer for that.</h3>
                <p>
                  We need applicable policy wording and claim evidence before
                  explaining this question. No answer has been generated.
                </p>
              </>
            ) : (
              <>
                <Badge>Authored demo answer</Badge>
                <h3>{clauses.find((c) => c.id === answer)!.title}</h3>
                <p>{clauses.find((c) => c.id === answer)!.explanation}</p>
                <SourceLink
                  source={clauses.find((c) => c.id === answer)!.source}
                />
                <p>
                  <strong>Uncertainty:</strong> The renewal receipt and room
                  schedule have not been supplied.
                </p>
                <p>
                  <strong>Next step:</strong>{" "}
                  {clauses.find((c) => c.id === answer)!.effect}
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
}
